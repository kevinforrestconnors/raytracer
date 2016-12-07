var GameObject = function(geometry, material, opts) {

	var opts = opts || {}

	this.geometry = geometry;
	this.material = material;
	this.type = opts.type || "???";
	this.interfaceItem = opts.interfaceItem || false;
	this.fixed = opts.fixed || false;
	this.opacity = opts.opacity || new Vector4(1, 1, 1, 1);
	this.radius = opts.radius || 1;
	this.width = opts.width || 1;
	this.height = opts.height || 1;
	this.mass     = opts.mass || Infinity; // must be > 0
	this.position = opts.position || new Vector3(0, 0, 0); 
	this.velocity = opts.velocity || new Vector3(0, 0, 0); 
	this.forces = opts.forces || {};
	this.orientation = opts.orientation || 0;
	this.angularVelocity = opts.angularVelocity || 0;
	this.angularAccel = opts.angularAccel || 0;
	this.scale = opts.scale || new Vector3(1, 1, 1);

	this.checkpoint = opts.checkpoint || null;

	this.updatePosition = opts.updatePosition || (function () {});
	
	this.modelMatrix = opts.modelMatrix || new Matrix4(); 
	this.modelMatrixInverse = opts.modelMatrixInverse || new Matrix4(); 
	this.modelViewProjMatrix = opts.modelViewProjMatrix || new Matrix4();
	this.quadrics = opts.quadrics || new Matrix4();

}

GameObject.prototype.draw = function(gl, dt, camera) {

	// this.updatePosition();

	// this.position.x += this.velocity.x;
	// this.position.y += this.velocity.y;
	// this.position.z += this.velocity.z;

	this.orientation += this.angularVelocity;
	
	this.modelMatrix.setIdentity();
	this.modelMatrix.translate(this.position);
	this.modelMatrix.rotateY(this.orientation);
	this.modelMatrix.scale(this.scale);

	this.modelMatrix.copyInto(this.modelMatrixInverse);
	this.modelMatrixInverse.invert();

	this.modelViewProjMatrix.setIdentity();
	camera.apply(this.modelViewProjMatrix);
	this.modelViewProjMatrix.multiply(this.modelMatrix);


	this.material.apply(gl);
	this.material.getMatrixUniform("modelMatrix").set(this.modelMatrix);
	this.material.getMatrixUniform("modelMatrixInverse").set(this.modelMatrixInverse);
	this.material.getMatrixUniform("modelViewProjMatrix").set(this.modelViewProjMatrix);
	this.material.getMatrixUniform("viewDirMatrix").set(camera.viewDirMatrix);
	this.material.getVector3Uniform("shadow").set(new Vector3(1, 1, 1));
	this.material.getVector3Uniform("eyePos").set(camera.position);
	this.material.getMatrixUniform("quadrics").setDirect(this.quadrics);

	this.geometry.draw(gl);
}

GameObject.prototype.drawShadow = function(gl, dt, camera) {

	this.updatePosition();

	this.position.x += this.velocity.x;
	this.position.y += this.velocity.y;
	this.position.z += this.velocity.z;

	this.orientation += this.angularVelocity;
	
	this.modelMatrix.setIdentity();
	this.modelMatrix.translate(new Vector3(0, 0.1, 0));
	this.modelMatrix.scale(new Vector3(1, 0, 1));
	this.modelMatrix.translate(this.position);

	this.modelMatrix.rotateY(this.orientation);
	this.modelMatrix.scale(this.scale);


	this.modelMatrix.copyInto(this.modelMatrixInverse);
	this.modelMatrixInverse.invert();

	this.modelViewProjMatrix.setIdentity();
	camera.apply(this.modelViewProjMatrix);
	this.modelViewProjMatrix.multiply(this.modelMatrix);


	this.material.apply(gl);
	this.material.getMatrixUniform("modelMatrix").set(this.modelMatrix);
	this.material.getMatrixUniform("modelMatrixInverse").set(this.modelMatrixInverse);
	this.material.getMatrixUniform("modelViewProjMatrix").set(this.modelViewProjMatrix);
	this.material.getMatrixUniform("viewDirMatrix").set(camera.viewDirMatrix);
	this.material.getVector3Uniform("shadow").set(new Vector3(0, 0, 0));
	this.material.getVector3Uniform("eyePos").set(camera.position);


	this.geometry.draw(gl);
}

GameObject.prototype.distance = function(vec3) {
	var dx = this.position.x - vec3.x;
	var dy = this.position.y - vec3.y;
	var dz = this.position.z - vec3.z;
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}











