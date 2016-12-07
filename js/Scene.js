

var Scene = function(gl, output) {

  this.camera = new PerspectiveCamera();

  this.loaded = false;

  this.keysPressed = keyboardMap;

  this.textures = {};
  this.textures.helicopter = new Texture(gl, "media/heli/heli.png");
  this.textures.balloon = new Texture(gl, "media/balloon.png");
  this.textures.tree = new Texture(gl, "media/tree.png")
  this.textures.slowpoke = new Texture(gl, "media/slowpoke/YadonDh.png");
  this.textures.grass = new Texture(gl, "media/grass.png");

  this.gameObjects = {};

  this.rVertex = new Shader(gl, gl.VERTEX_SHADER, 'raytracer_vs.essl');
  this.rFragment = new Shader(gl, gl.FRAGMENT_SHADER, 'raytracer_fs.essl');
  this.rProgram = new Program(gl, this.rVertex, this.rFragment);
  this.rProgram.apply(gl);

  var self = this;

  // var request6 = new XMLHttpRequest(); 
  // request6.open("GET", "media/sphere.json"); 
  // request6.onreadystatechange = function () {
  //   if (request6.readyState == 4) {
  //     var jsonMesh = JSON.parse(request6.responseText).meshes[0];
  //     self.meshGeometry6 = new MeshGeometry(gl, jsonMesh);
  //     self.sphereMaterial = new Material(gl, self.rProgram);
  //     //self.sphereMaterial.setTexture("colorTexture", self.textures.slowpoke);
      
  //     self.gameObjects.sphere = new GameObject(self.meshGeometry6, self.sphereMaterial, {
  //       scale: new Vector3(0.1, 0.1, 0.1),
  //       position: new Vector3(0, 0, 0)
  //     });

  //     self.loaded = true;
  //   };
  // };
  // request6.send();

  this.quadGeometry1 = new QuadGeometry(gl);
  this.backgroundMaterial = new Material(gl, this.rProgram);

  this.skyCubeTexture = new TextureCube(gl, [
    "media/envmap/posx.jpg",
    "media/envmap/negx.jpg",
    "media/envmap/posy.jpg",
    "media/envmap/negy.jpg",
    "media/envmap/posz.jpg",
    "media/envmap/negz.jpg"
  ]);

  this.backgroundMaterial.setTexture("envMapTexture", this.skyCubeTexture);
  this.gameObjects.background = new GameObject(this.quadGeometry1, self.backgroundMaterial);

  this.quadricsData = new Float32Array([
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
            0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
            0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
            0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
            0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
            0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
            0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
            0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
            0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
            0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
            0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
            0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
            0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
            0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
            0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
            0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
            0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
            0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
            0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
            0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0

  ]);

  this.clippedQuadrics = [];

  for (var i = 0; i < this.quadricsData.length / 2; i++) {
    var a = new Matrix4();
    a.storage = this.quadricsData.subarray(i*32, i*32+16);
    var b = new Matrix4();
    b.storage = this.quadricsData.subarray(i*32+16, i*32+32);
    this.clippedQuadrics.push(new ClippedQuadric(a, b));
  }

  // Snowman
  this.clippedQuadrics[0].setUnitSphere(10).translate(5, 0, 5);
  this.clippedQuadrics[1].setUnitSphere(6).translate(5, 4, 5);
  this.clippedQuadrics[2].setUnitSphere(4).translate(5, 7.5, 5);
  // Eyes
  this.clippedQuadrics[3].setUnitSphere().scale(0.25, 0.25, 0.25).translate(5.7, 8, 3)
  this.clippedQuadrics[4].setUnitSphere().scale(0.25, 0.25, 0.25).translate(4.5, 8, 3)

  // Nose
  this.clippedQuadrics[5].setUnitCone().rotate("x", Math.PI / 2).scale(0.25, 0.25, 2).translate(5, 7.5, 1.5)

  // Wood Floor
  this.clippedQuadrics[6].setUnitPlane("y").translate(0, -4, 0);

  // Candle
  this.clippedQuadrics[7].setUnitCylinder(4, 40).translate(-10, 0, 10); // wax
  this.clippedQuadrics[8].setUnitSphere().scale(0.5, 2, 0.5).translate(-10, Math.sqrt(40) + 1, 10) // flame

  // Presents
  this.clippedQuadrics[9].setUnitPlane("x").translate(0, -4, 0);



  this.gameObjects.background.quadrics = this.quadricsData;


  this.loaded = true;

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.DEPTH_TEST);

  // Draw 
  this.timeAtLastFrame = 0;

}

Scene.prototype.draw = function(gl) {

  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0; 
  this.timeAtLastFrame = timeAtThisFrame;

  for (var gobj in this.gameObjects) {

    var o = this.gameObjects[gobj];

    // if (o.type != "groundPlane" && o.type != "background") {
    //   o.drawShadow(gl, dt, this.camera);
    // }
   
    o.draw(gl, dt, this.camera);

    this.camera.move(dt, this.keysPressed);


  } // end draw loop


}

Scene.prototype.keyDown = function(event) {
  this.keysPressed[String.fromCharCode(event.keyCode)] = true;
}

Scene.prototype.keyUp = function(event) {
  this.keysPressed[String.fromCharCode(event.keyCode)] = false;
}

Scene.prototype.resize = function() {
  this.camera.setAspectRatio(app.canvas.width / app.canvas.height);
}

Scene.prototype.mouseDown = function(event) {
  this.camera.mouseDown(event);
}

Scene.prototype.mouseMove = function(event) {
  this.camera.mouseMove(event);
}

Scene.prototype.mouseUp = function(event) {
  this.camera.mouseUp(event);
}
