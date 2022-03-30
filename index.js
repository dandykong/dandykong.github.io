let canvas = null;
let gl = null;

function onResize() {
	canvas.width = canvas.clientWidth * window.devicePixelRatio;
	canvas.height = canvas.clientHeight * window.devicePixelRatio;
}

window.onresize = onResize;

function onFrame() {
	gl.clearColor(0.3, 1.0, 0.4, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	window.requestAnimationFrame(onFrame);
}

function initWebGL2() {
	canvas = document.createElement("canvas");
	gl = canvas.getContext("webgl2");
	if(!gl) {
		alert("This browser does not support WebGL 2.");
		return;
	}
	canvas.style = "position: absolute; width: 100%; height: 100%; left: 0; top: 0; right: 0; bottom: 0; margin: 0; z-index: -1;";
	document.body.appendChild(canvas);
	onResize();
	
	gl.clearColor(1.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	window.requestAnimationFrame(onFrame);
}

initWebGL2();