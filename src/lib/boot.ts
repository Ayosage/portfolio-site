// Runs inline in <body> before hydration so theme and brightness are set
// pre-paint. Static string, no user input; keep it ES5 and self-contained.
export const bootScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('bs01-theme');if(['green','amber','paper'].indexOf(t)<0){t='green'}d.dataset.theme=t;var b=Number(localStorage.getItem('bs01-brightness'));d.dataset.brightness=(b>=1&&b<=5)?String(b):'3'}catch(e){d.dataset.theme='green';d.dataset.brightness='3'}})()`
