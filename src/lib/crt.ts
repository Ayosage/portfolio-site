// The tube. One fullscreen triangle, one fragment shader: curvature, scanlines
// as a raster consequence, phosphor glow field, rolling bar, noise, boot
// re-raster, glitch tear, degauss wobble, and the glass reflection band that
// slides with the pointer (u_px). Colours are the green tokens.
export const CRT_FRAG = `
precision mediump float;
uniform vec2 u_res; uniform float u_time, u_boot, u_glitch, u_flash, u_degauss, u_scan, u_bright, u_motion, u_px;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 curve(vec2 uv){ uv = uv * 2.0 - 1.0; vec2 o = abs(uv.yx) / vec2(7.0, 5.5); uv = uv + uv * o * o; return uv * 0.5 + 0.5; }
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 c = curve(uv);
  float dg = u_degauss;
  c += vec2(sin(c.y * 18.0 + u_time * 30.0), cos(c.x * 14.0 + u_time * 26.0)) * dg * 0.012;
  float rowi = floor(c.y * 36.0 + u_time * 6.0);
  float g = u_glitch * step(0.55, hash(vec2(rowi * 3.1, floor(u_time * 24.0))));
  c.x += (hash(vec2(rowi, floor(u_time * 24.0))) - 0.5) * g * 0.08;
  float band = smoothstep(0.0, 0.03, u_boot * 1.02 - abs(c.y - 0.5) * 2.0);
  float d = length((c - 0.5) * vec2(1.2, 1.0));
  float vig = smoothstep(0.0, 0.22, c.x) * smoothstep(1.0, 0.78, c.x) * smoothstep(0.0, 0.2, c.y) * smoothstep(1.0, 0.8, c.y);
  float inb = step(0.0, c.x) * step(c.x, 1.0) * step(0.0, c.y) * step(c.y, 1.0);
  vec3 ground = vec3(0.051, 0.067, 0.043);
  vec3 phos = vec3(0.847, 0.949, 0.431);
  float roll = fract(c.y - u_time * 0.06 * u_motion);
  float bar = 0.035 * smoothstep(0.0, 0.14, roll) * smoothstep(0.3, 0.14, roll) * u_motion;
  float noise = (hash(c * (u_time * u_motion + 1.0) * 60.0) - 0.5) * 0.018;
  float glow = 0.05 * smoothstep(0.95, 0.0, d);
  float scan = mix(1.0, 0.86 + 0.14 * sin(c.y * u_res.y * 2.1), u_scan);
  vec3 col = (ground + phos * (glow + bar + noise)) * scan;
  col += phos * dg * 0.25 * (0.5 + 0.5 * sin(c.x * 40.0 + u_time * 40.0));
  col *= mix(0.45, 1.0, vig);
  col *= mix(0.8, 1.25, clamp(u_bright, 0.0, 1.5) / 1.35);
  col += phos * u_flash;
  col *= inb * band;
  // Glass reflection: a soft diagonal band on the flat face (uv, not the
  // curved picture), swept by the pointer. Same look as the old DOM band
  // (112deg, 6% white peak) but drawn here, where the tube already redraws.
  float r = uv.x * 0.927 + (1.0 - uv.y) * 0.375 + u_px * 0.24;
  float refl = 0.06 * exp(-pow((r - 0.62) / 0.11, 2.0)) + 0.012 * exp(-pow((r - 0.72) / 0.06, 2.0));
  col += vec3(refl) * inb;
  gl_FragColor = vec4(col, 1.0);
}`

export type Gl = {
  /** Size in CSS pixels; rendered at 1× regardless of DPR (the tube is soft). */
  resize(cssW: number, cssH: number): void
  set(name: string, v: number): void
  draw(): void
  lose(): void
}

export function createGL(canvas: HTMLCanvasElement): Gl | null {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false })
  if (!gl) return null
  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)
    if (!s) return null
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null
    return s
  }
  const vs = shader(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}')
  const fs = shader(gl.FRAGMENT_SHADER, CRT_FRAG)
  const program = gl.createProgram()
  if (!vs || !fs || !program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.useProgram(program)
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(program, 'p')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  const uniforms = new Map<string, WebGLUniformLocation | null>()
  const u = (n: string) => {
    if (!uniforms.has(n)) uniforms.set(n, gl.getUniformLocation(program, n))
    return uniforms.get(n) ?? null
  }
  return {
    resize(cssW, cssH) {
      const w = Math.max(1, Math.floor(cssW))
      const h = Math.max(1, Math.floor(cssH))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
        gl.uniform2f(u('u_res'), w, h)
      }
    },
    set(name, v) {
      gl.uniform1f(u(name), v)
    },
    draw() {
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
    lose() {
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
