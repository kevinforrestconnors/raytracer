var Program = function(gl, vertexShader, fragmentShader) {
	this.gl = gl;
	this.sourceFileNames = "[" + vertexShader.sourceFileName + " , " + fragmentShader.sourceFileName + "]"; 
	this.glProgram = gl.createProgram();
	gl.attachShader(this.glProgram, vertexShader.glShader);
	gl.attachShader(this.glProgram, fragmentShader.glShader); 
	gl.bindAttribLocation(this.glProgram, 0, "modelPos");
	gl.bindAttribLocation(this.glProgram, 1, "modelNormal");
	gl.bindAttribLocation(this.glProgram, 2, "modelTexCoord");
	gl.bindAttribLocation(this.glProgram, 3, "opacity");
	gl.linkProgram(this.glProgram);
	if (!gl.getProgramParameter(this.glProgram, gl.LINK_STATUS)) {
		alert("Error when linking shaders [vertex shader:" + vertexShader.sourceFileName + 
			"]:[fragment shader: "+ vertexShader.sourceFileName + "]\n" + gl.getProgramInfoLog(this.glProgram)); 
	}
}

Program.prototype.getUniformLocation = function(uniformName) {
	var location = this.gl.getUniformLocation(this.glProgram, uniformName); 
	if (location == null)
		alert("Could not find uniform " + uniformName + " in program " + this.sourceFileNames + ".");
	else
		return location;
}

Program.prototype.apply = function(gl) {
	gl.useProgram(this.glProgram);
}

