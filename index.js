let canvas = null;

function onResize() {
	canvas.width = canvas.clientWidth * window.devicePixelRatio;
	canvas.height = canvas.clientHeight * window.devicePixelRatio;
}

window.onresize = onResize;

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
	
	const renderer = new webgfx.Renderer();
	renderer.clear([0.3, 1.0, 0.4, 1.0]);
	
	const mesh = new webgfx.Mesh();
	mesh.loadFromData(webgfxGlobals.triangle);

	const material = new webgfx.Material();
	const identityMatrix = new Float32Array([
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0
	]);
	material.setProjection(identityMatrix);
	material.setView(identityMatrix);
	material.setModel(identityMatrix);
	
	function onFrame() {
		gl.viewport(0, 0, canvas.width, canvas.height);
		renderer.clear([0.3, 1.0, 0.4, 1.0]);

		renderer.draw(mesh, material);

		window.requestAnimationFrame(onFrame);
	}
	window.requestAnimationFrame(onFrame);
}

initWebGL2();