var Shader = function(gl, shaderType, sourceFileName) {
	this.sourceFileName = sourceFileName;
	this.glShader = gl.createShader(shaderType); 
	gl.shaderSource(this.glShader, shaderSource[sourceFileName]);
	 gl.compileShader(this.glShader);
	if (!gl.getShaderParameter(this.glShader, gl.COMPILE_STATUS)) {
		console.log("Error in shader " + sourceFileName + ":\n" + gl.getShaderInfoLog(this.glShader)); 
	}
}