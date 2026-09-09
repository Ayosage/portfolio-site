// Runs inline in <body> before hydration so brightness and scanlines are set
// pre-paint. Static string, no user input; keep it ES5 and self-contained.
export const bootScript = `(function(){var d=document.documentElement;try{var b=Number(localStorage.getItem('bs01-brightness'));d.dataset.brightness=(b>=1&&b<=5)?String(b):'3';d.dataset.scanlines=localStorage.getItem('bs01-scanlines')==='off'?'off':'on'}catch(e){d.dataset.brightness='3';d.dataset.scanlines='on'}})()`
