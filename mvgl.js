let gl = null;
const mvgl = {
	VertexBuffer: class {
		constructor() {
			this.va = gl.createVertexArray();
			gl.bindVertexArray(this.va);
			
			this.va = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vb);
			
			this.stride = 0;
			this.length = 0;
			this.vertices = 0;
			
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			gl.bindVertexArray(null);
		}
		free() {
			gl.deleteBuffer(this.vb);
			gl.deleteVertexArray(this.va);
		}
		
		vertexLayout(layout = [3, 2, 3]) {
			for(let i = 0; i < layout.length; i++) {
				this.stride += layout[i] * 4;
			}
			
			gl.bindVertexArray(this.va);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vb);
			
			let istride = 0;
			for(let i = 0; i < layout.length; i++) {
				gl.vertexAttribPointer(i, layout[i], gl.FLOAT, false, this.stride, istride);
				gl.enableVertexAttribArray(i);

				istride += layout[i] * 4;
			}
			
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			gl.bindVertexArray(null);

			this.stride = this.stride / 4;
			this.vertices = this.length / this.stride;
		}
		vertexData(data) {
			this.length = data.length;
			gl.bindVertexArray(this.va);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vb);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			gl.bindVertexArray(null);
			this.vertices = this.length / this.stride;
		}
		draw() {
			gl.bindVertexArray(this.va);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vb);

			gl.drawArrays(gl.TRIANGLES, 0, this.vertices);

			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			gl.bindVertexArray(null);
		}
		
	},
	SubShader: class {
		constructor(type, str) {
			this.shader = gl.createShader(type);
			gl.shaderSource(this.shader, str);
			gl.compileShader(this.shader);
		}
		free() {
			gl.deleteShader(this.shader);
		}
	},
	Shader: class {
		constructor() {
			this.program = gl.createProgram();
		}
		free() {
			gl.deleteProgram(this.program);
		}

		join(subshader) {
			gl.attachShader(this.program, subshader.shader);
			return this;
		}
		link() {
			gl.linkProgram(this.program);
			gl.useProgram(this.program);
			gl.useProgram(null);
			return this;
		}

		bind() {
			gl.useProgram(this.program);
			return this;
		}
		unbind() {
			gl.useProgram(null);
			return this;
		}

		
		set1i(name, val) {
			gl.uniform1i(gl.getUniformLocation(this.program, name), val);
			return this;
		}
		set1f(name, val) {
			gl.uniform1f(gl.getUniformLocation(this.program, name), val);
			return this;
		}
		set2f(name, x, y) {
			gl.uniform2f(gl.getUniformLocation(this.program, name), x, y);
			return this;
		}
		set3f(name, x, y, z) {
			gl.uniform3f(gl.getUniformLocation(this.program, name), x, y, z);
			return this;
		}
		set4f(name, x, y, z, w) {
			gl.uniform4f(gl.getUniformLocation(this.program, name), x, y, z, w);
			return this;
		}
		set4x4f(name, mat) {
			gl.uniformMatrix4fv(gl.getUniformLocation(this.program, name), false, mat);
			return this;
		}
	},
	Texture: class {
		constructor() {
			this.texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
		free() {
			gl.deleteTexture(this.texture);
		}

		fromFile(url, options = {wrap: gl.REPEAT, filter: gl.NEAREST}) {
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, options.wrap);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, options.wrap);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, options.filter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, options.filter);
			let that = this;
			const img = new Image();
			img.onload = function() {
				gl.bindTexture(gl.TEXTURE_2D, that.texture);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
			};
			img.src = url;
		}
		fromData(data, options = {wrap: gl.REPEAT, filter: gl.NEAREST}) {
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(data));
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, options.wrap);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, options.wrap);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, options.filter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, options.filter);
		}

		bind(slot = 0) {
			gl.activeTexture(gl.TEXTURE0 + slot);
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
		}
	}
};