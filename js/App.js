var app;
var overlay;

// App constructor
var App = function(canvas) {

	// set a pointer to our canvas
	this.canvas = canvas;
	
	// if no GL support, cry
	this.gl = canvas.getContext("experimental-webgl");
	var gl = this.gl;
	if (this.gl == null) {
		alert( ">>> Browser does not support WebGL <<<" );
		return;
	}
	
	// set the initial canvas size and viewport
	this.screenResize();

	// create a simple scene
	this.scene = new Scene(this.gl);
	var scene = this.scene;


	document.onkeydown = function(e) { scene.keyDown(e); }; 
	document.onkeyup = function(e) { scene.keyUp(e); };

	canvas.onmousedown = function(e) {scene.mouseDown(e)};
	canvas.onmousemove = function(e) {
		e.stopPropagation();
		scene.mouseMove(e); 
	};

	canvas.onmouseout = function(e) {
		scene.mouseUp(e);
	};

	canvas.onmouseup = function(e) {
		scene.mouseUp(e);
	};

	window.addEventListener('resize', function() {
		scene.resize();
	});			
}
	
	// entry point from HTML
window.addEventListener('load', function() {

	var canvas = document.getElementById("canvas");
	overlay = document.getElementById("overlay");
	overlay.innerHTML = "WebGL";

	app = new App(canvas);
	
	var si = setInterval(function() {

		console.log("loading")
		if (app.scene.loaded) {

			window.requestAnimationFrame(function() {
				app.update();
			});

			clearInterval(si);
		}

	}, 100);

});

// animation frame update
App.prototype.update = function() {
	
	// clear the screen
    this.gl.clearColor(0.1, 0.3, 0.7, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	
	// draw scene
	this.scene.draw(this.gl)

	// refresh
	window.requestAnimationFrame(function() {
		app.update();
	});
}

App.prototype.screenResize = function() {
	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;
	this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
}



