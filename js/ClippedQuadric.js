var ClippedQuadric = function(surfaceCoeffMatrix, clipperCoeffMatrix) {
	this.surfaceCoeffMatrix = surfaceCoeffMatrix;
	this.clipperCoeffMatrix = clipperCoeffMatrix;
}


ClippedQuadric.prototype.transform = function(matrix) {
	matrix.invert();

	this.surfaceCoeffMatrix.transposeMultiply(matrix);
	this.surfaceCoeffMatrix.transposeMultiply(matrix);

	this.clipperCoeffMatrix.transposeMultiply(matrix);
	this.clipperCoeffMatrix.transposeMultiply(matrix);

	return this;
}

ClippedQuadric.prototype.transformClipper = function(transMatrix) {

	transMatrix.invert();

	this.clipperCoeffMatrix.transposeMultiply(transMatrix);
	this.clipperCoeffMatrix.transposeMultiply(transMatrix);
}

ClippedQuadric.prototype.translate = function(x, y, z) {
	this.transform(new Matrix4(1, 0, 0, 0, 
		 	 	 	 	       0, 1, 0, 0, 
		 	 	 	 	       0, 0, 1, 0, 
		 	 	 	 	       x, y, z, 1));
	return this;
}

ClippedQuadric.prototype.scale = function(x, y, z) {
	this.transform(new Matrix4(x, 0, 0, 0,
							   0, y, 0, 0,
							   0, 0, z, 0,
							   0, 0, 0, 1));
	return this;
}

ClippedQuadric.prototype.rotate = function(axis, angle) {

	var cos = Math.cos;
	var sin = Math.sin;

	if (axis == "x") {
		this.transform(new Matrix4(1, 0, 0, 0, 
		 	 	 	 	           0, cos(angle), -sin(angle), 0, 
		 	 	 	 	           0, sin(angle), cos(angle), 0, 
		 	 	 	 	           0, 0, 0, 1));
	} else if (axis == "y") {
		this.transform(new Matrix4(cos(angle), 0, sin(angle), 0, 
		 	 	 	 	           0, 1, 0, 0, 
		 	 	 	 	           -sin(angle), 0, cos(angle), 0, 
		 	 	 	 	           0, 0, 0, 1));
	} else if (axis == "z") {
		this.transform(new Matrix4(cos(angle), -sin(angle), 0, 0, 
		 	 	 	 	           sin(angle), cos(angle), 0, 0, 
		 	 	 	 	           0, 0, 1, 0, 
		 	 	 	 	           0, 0, 0, 1));		
	}

	return this;
}

ClippedQuadric.prototype.setUnitPlane = function(axis) {
	this.surfaceCoeffMatrix.setIdentity();
	this.surfaceCoeffMatrix.setDiagonal(new Vector4(0, 1, 0, -5));
	this.clipperCoeffMatrix.setIdentity();
	this.clipperCoeffMatrix.setDiagonal(new Vector4(0, 0, 0, 0));

	return this;
}

ClippedQuadric.prototype.setUnitSphere = function(radius) {

	if (!radius) {var radius = -1} else {radius *= -1}

	this.surfaceCoeffMatrix.setIdentity();
	this.surfaceCoeffMatrix.setDiagonal(new Vector4(1, 1, 1, radius));
	this.clipperCoeffMatrix.setIdentity();
	this.clipperCoeffMatrix.setDiagonal(new Vector4(0, 1, 0, radius));

	return this;
}

ClippedQuadric.prototype.setUnitCylinder = function(radius, height) {

	if (!radius) {var radius = -1} else {radius *= -1}
	if (!height) {var height = -1} else {height *= -1}

	this.surfaceCoeffMatrix.setIdentity();
	this.surfaceCoeffMatrix.setDiagonal(new Vector4(1, 0, 1, radius));
	this.clipperCoeffMatrix.setIdentity();
	this.clipperCoeffMatrix.setDiagonal(new Vector4(0, 1, 0, height));

	return this;
}

ClippedQuadric.prototype.setUnitCone = function() {

	if (!radius) {var radius = -1} else {radius *= -1}
	if (!height) {var height = 1}

	this.surfaceCoeffMatrix.setIdentity();
	this.surfaceCoeffMatrix.setDiagonal(new Vector4(1, -1, 1, 0));

	this.clipperCoeffMatrix.setIdentity();
	this.clipperCoeffMatrix.setDiagonal(new Vector4(0, 1, 0, -1));

	var clipperMatrix = new Matrix4();
  	clipperMatrix.setIdentity();
  	clipperMatrix.translate(0, -1, 0);
  	this.transformClipper(clipperMatrix);

  	return this;
}


// ClippedQuadric.prototype.setUnitCone = function(radius, height) {

// 	if (!radius) {var radius = -1} else {radius *= -1}
// 	if (!height) {var height = -1} else {height *= -1}

// 	this.surfaceCoeffMatrix.setIdentity();
// 	this.surfaceCoeffMatrix.setDiagonal(new Vector4(1, -5, 1, radius));
// 	this.clipperCoeffMatrix.setIdentity();
// 	this.clipperCoeffMatrix.setDiagonal(new Vector4(0, 1, 0, height));
// }


