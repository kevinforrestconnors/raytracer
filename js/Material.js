var Material = function(gl, program) { 

	this.program = program; 
	this.uniformSettings = []; // contains functions that set uniforms
	this.textureBindings = []; // contains texture objects to bind

	var addUniformMethod = function(gl, methodName) {
		Material.prototype[methodName] = function(uniformName, ...values) {
			var location = gl.getUniformLocation(this.program.glProgram, uniformName);
			if(location == null) {
				alert("Could not find uniform " + uniformName + ".");
			} else {
				this.uniformSettings.push(function() {
					gl[methodName].apply(gl, [location, ...values]);
				});
			}
	 	}
	}
	
	// only do this once
	if(!Material.prototype.hasOwnProperty("uniform1i")) {
		for (var methodName in gl) {
			if(methodName.startsWith("uniform")) {
				addUniformMethod(gl, methodName);
			}
	 	}
	}

} // material constructor ends

Material.prototype.setTexture = function(samplerName, texture) {

	this.uniform1i(samplerName, this.textureBindings.length);
	this.textureBindings.push( texture );
}

// You can use this method as a template to create similar methods for different uniform types as needed
Material.prototype.getMatrixUniform = function(uniformName) {
	var location = this.program.getUniformLocation(uniformName); 
	var floatArray = new Float32Array(16);
	var gl = this.program.gl;
	return { 
		set: function(m) {
			m.copyIntoArray(floatArray, 0);
			gl.uniformMatrix4fv(location, false, floatArray); 
		},
		setDirect: function(m) {
			gl.uniformMatrix4fv(location, false, m);
		}
	};
// returns an object with a ‘set’ method that sets the uniform // directly, taking a Matrix4 as parameter
}

Material.prototype.getVecUniform = function(uniformName) {
	var location = this.program.getUniformLocation(uniformName); 
	var gl = this.program.gl;
	return { 
		set: function(m) {
			gl.uniform4f(location, m.x, m.y, m.z, m.w); 
		}
	};
// returns an object with a ‘set’ method that sets the uniform // directly, taking a Vec4 as parameter
}

Material.prototype.getVector3Uniform = function(uniformName) {
	var location = this.program.getUniformLocation(uniformName); 
	var gl = this.program.gl;
	return {
		set: function(vector){
			gl.uniform3f(location, vector.x, vector.y, vector.z);
		}
	};
// returns an object with a ‘set’ method that sets the uniform // directly, taking a Vec3 as parameter
}

Material.prototype.getVector4ArrayUniform = function(uniformName, elementCount){

  var location = this.program.getUniformLocation(uniformName);
  var floatArray = new Float32Array(elementCount * 4);
  var gl = this.program.gl;

  return { set: function(vectorArray){

    for (var i = 0; i < elementCount; i++) {
      floatArray[i*4+0] = vectorArray[i].x;
      floatArray[i*4+1] = vectorArray[i].y;
      floatArray[i*4+2] = vectorArray[i].z;
      floatArray[i*4+3] = vectorArray[i].w;      

    }

    gl.uniform4fv(location, floatArray);

   }};

}

Material.prototype.apply = function(gl) {

	this.program.apply(gl);

	for(var i=0; i < this.uniformSettings.length; i++) {
		this.uniformSettings[i]();
	}
	for (var j=0; j < this.textureBindings.length; j++) {
		gl.activeTexture(gl.TEXTURE0 + j);
		gl.bindTexture(this.textureBindings[j].bindingPoint, this.textureBindings[j].glTexture);
	}


}