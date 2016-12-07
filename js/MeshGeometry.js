var MeshGeometry = function(gl, json) {

	this.vertexBuffer = gl.createBuffer(); 
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, 
	  new Float32Array(json.vertices), gl.STATIC_DRAW);

	this.vertexNormalBuffer = gl.createBuffer(); 
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, 
	  new Float32Array(json.normals), gl.STATIC_DRAW);

	this.vertexTexCoordBuffer = gl.createBuffer(); 
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer); 
	gl.bufferData(gl.ARRAY_BUFFER, 
	  new Float32Array(json.texturecoords[0]), gl.STATIC_DRAW);

	var t = [].concat.apply([], json.faces);
	this.numberOfIndices = t.length;

	this.indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(t), gl.STATIC_DRAW);
}

MeshGeometry.prototype.draw = function(gl) {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer); 
	gl.enableVertexAttribArray(0); 
	gl.vertexAttribPointer(0,
		3, gl.FLOAT, //< three pieces of float
		false, //< do not normalize (make unit length) 
		0, //< tightly packed
		0 //< data starts at array start
	);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer); gl.enableVertexAttribArray(1);
	gl.vertexAttribPointer(1,
		3, gl.FLOAT, //< three pieces of float
		false, //< do not normalize (make unit length) 
		0, //< tightly packed
		0 //< data starts at array start
	);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer); gl.enableVertexAttribArray(2);
	gl.vertexAttribPointer(2,
		2, gl.FLOAT, //< two pieces of float
		false, //< do not normalize (make unit length) 
		0, //< tightly packed
		0 //< data starts at array start
	);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.drawElements(gl.TRIANGLES, this.numberOfIndices, gl.UNSIGNED_SHORT, 0); 
}





