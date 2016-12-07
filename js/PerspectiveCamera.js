var PerspectiveCamera = function() {

	this.position = new Vector3(0.0, 0.0, 0.0); 
	this.ahead = new Vector3(0.0, 0.0, 1.0);
	this.right = new Vector3(1.0, 0.0, 0.0);
	this.up = new Vector3(0.0, 1.0, 0.0);

	this.yaw = 0.0; 
	this.pitch = 0.0;
	this.fov = 1.0;
	this.aspect = 1.0;
	this.nearPlane = 0.1;
	this.farPlane = 1000.0;

	this.viewMatrix = new Matrix4(); 
	this.updateViewMatrix(); 
	this.projMatrix = new Matrix4(); 
	this.updateProjMatrix();
	this.viewDirMatrix = new Matrix4();
	this.updateViewDirMatrix();

	this.speed = 25.0;
	this.isDragging = false;
	this.mouseDelta = new Vector2(0.0, 0.0);
}

PerspectiveCamera.prototype.updateViewMatrix = function() {
	this.viewMatrix.setValues(
		this.right.x, this.up.x, this.ahead.x, 0,
		this.right.y, this.up.y, this.ahead.y, 0,
		this.right.z, this.up.z, this.ahead.z, 0,
		0,            0,         0,            1
	);

	this.viewMatrix.translate(this.position.scaled(-1)); 
	
};

PerspectiveCamera.prototype.updateProjMatrix = function() {
	var yScale = 1.0 / Math.tan(this.fov * 0.5); 
	var xScale = yScale / this.aspect;
	var zf = this.farPlane;
	var zn = this.nearPlane; 
	this.projMatrix.setValues(
		xScale, 0, 0, 0, 
		0, yScale, 0, 0, 
		0, 0, zf/(zf-zn), 1, 
		0, 0, -zn*zf/(zf-zn), 0
	);
};

PerspectiveCamera.prototype.move = function(dt, keysPressed) { 

	if(this.isDragging) {

		this.yaw += this.mouseDelta.x * 0.002;
		this.pitch += this.mouseDelta.y * 0.002;

		if (this.pitch > 3.14/2.0) {this.pitch = 3.14/2.0}; 
		if (this.pitch < -3.14/2.0) {this.pitch = -3.14/2.0}; 

		this.mouseDelta = new Vector2(0.0, 0.0); 
		this.ahead = new Vector3(Math.sin(this.yaw) * Math.cos(this.pitch), -Math.sin(this.pitch), Math.cos(this.yaw) * Math.cos(this.pitch));
		this.right = this.ahead.cross(new Vector3(0.0, -1.0, 0.0) );
		this.right.normalize();
		this.up = this.ahead.cross(this.right);
	}
	
	var wup = new Vector3(0, 1, 0); 

	if(keysPressed['W']) {this.position.add(this.ahead.scaled( this.speed * dt ))}
	if(keysPressed['S']) {this.position.sub(this.ahead.scaled( this.speed * dt ))}
	if(keysPressed['A']) {this.position.sub(this.right.scaled( this.speed * dt ))}
	if(keysPressed['D']) {this.position.add(this.right.scaled( this.speed * dt ))}
	if(keysPressed['Q']) {this.position.sub(wup.scaled( this.speed * dt ))}
	if(keysPressed['E']) {this.position.add(wup.scaled( this.speed * dt ))}

	this.updateViewMatrix();
	this.updateViewDirMatrix();

}

// must call this every time camera orientation changes
PerspectiveCamera.prototype.updateViewDirMatrix = function() {
	this.viewDirMatrix.setIdentity();
	this.viewDirMatrix.multiply(this.projMatrix);
	this.viewDirMatrix.multiply(this.viewMatrix);
	this.viewDirMatrix.translate(this.position);
	this.viewDirMatrix.invert();
};

PerspectiveCamera.prototype.setAspectRatio = function(ar) {
	this.aspect = ar;
	this.updateProjMatrix(); 
}

PerspectiveCamera.prototype.mouseDown = function(event) {
	this.isDragging = true;
	this.mouseDelta.setZero();
}

PerspectiveCamera.prototype.mouseMove = function(event) {
	this.mouseDelta.x += event.movementX;
	this.mouseDelta.y += event.movementY;
	event.preventDefault();
}

PerspectiveCamera.prototype.mouseUp = function(event) {
	this.isDragging = false;
}

PerspectiveCamera.prototype.apply = function(m) {
	m.multiply(this.projMatrix); 
	m.multiply(this.viewMatrix);
}