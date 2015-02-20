/* 
 * Javascript file for the view/controller, mostly for manipulating
 * the canvas element (graph) and the play/pause button.
 * A namespace is used to avoid polluting the global namespace.
 */

var maverick = maverick || {};
maverick.init = {};

// Implement this module for the maverick namespace
maverick.init = function() {
	
	function draw() {
		// Getting the context for the Canvas on the screen
		var canvas = document.getElementById("graph_canvas");
		var context = canvas.getContext("2d");
		
		// Open a new path
		context.beginPath();
		
		// Set the first point (a path starts with no points)
		context.moveTo(40, 20);
		
		// Create line from the first point to the specified point
		context.lineTo(40, 344);
		
		context.lineTo(490, 344);
		
		context.lineTo(490, 339);
		
		// Set the fill color to black
		context.fillStyle = "rgb(0,0,0)";
		
		// Draw the y-axis
		context.stroke();
		
	}
	
	window.onload = draw;
	
};

// Invoke the module
maverick.init();
