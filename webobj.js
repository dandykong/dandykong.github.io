const webobj = {
	insertXYZ: function(array, x, y, z) {
		array.push(x);
		array.push(y);
		array.push(z);
	},
	insertUV: function(array, u, v) {
		array.push(u);
		array.push(v);
	},
	getX: function(array, index) {
		return array[index * 3];
	},
	getY: function(array, index) {
		return array[index * 3 + 1];
	},
	getZ: function(array, index) {
		return array[index * 3 + 2];
	},
	getU: function(array, index) {
		return array[index * 2];
	},
	getV: function(array, index) {
		return array[index * 2 + 1];
	},
	getIndex: function(index) {
		return parseInt(index) - 1;
	},
	insertVertex: function(dest, positions, texcoords, normals, vertstr) {
		const indicesStr = vertstr.split("/");
		const indexPos = webobj.getIndex(indicesStr[0]);
		const indexTex = webobj.getIndex(indicesStr[1]);
		const indexNor = webobj.getIndex(indicesStr[2]);

		dest.push(webobj.getX(positions, indexPos));
		dest.push(webobj.getY(positions, indexPos));
		dest.push(webobj.getZ(positions, indexPos));

		dest.push(webobj.getU(texcoords, indexTex));
		dest.push(webobj.getV(texcoords, indexTex));
		
		dest.push(webobj.getX(normals, indexNor));
		dest.push(webobj.getY(normals, indexNor));
		dest.push(webobj.getZ(normals, indexNor));
	},
	load: function(obj) {
		let dest = [];
		let positions = [];
		let texcoords = [];
		let normals = [];
		
		const lines = obj.split("\n");
		for(let i = 0; i < lines.length; i++) {
			const line = lines[i].split(" ");
			
			if(line[0] == "vt") {
				webobj.insertUV(texcoords, parseFloat(line[1]), parseFloat(line[2]));
			}
			else if(line[0] == "vn") {
				webobj.insertXYZ(normals, parseFloat(line[1]), parseFloat(line[2]), parseFloat(line[3]));
			}
			else if(line[0] == "v") {
				webobj.insertXYZ(positions, parseFloat(line[1]), parseFloat(line[2]), parseFloat(line[3]));
			}
			else if(line[0] == "f") {
				webobj.insertVertex(dest, positions, texcoords, normals, line[1]);
				webobj.insertVertex(dest, positions, texcoords, normals, line[2]);
				webobj.insertVertex(dest, positions, texcoords, normals, line[3]);
			}
		}
		return dest;
	},
};