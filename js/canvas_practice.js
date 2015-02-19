/* 
 * Javascript file for the practice with the Canvas element in HTML5.
 * A namespace is used to avoid polluting the global namespace.
 */

var practice = practice || {};
practice.init = {};

// Implement this module for the practice namespace
practice.init = function() {
	
	function draw() {
		// Getting the context for the Canvas on the screen
		var canvas = document.getElementById("tutorial");
		var context = canvas.getContext("2d");
		
		/*
		// Draw a 45x40 red rectangle at (10,10)
		context.fillStyle = "rgb(200, 0, 0)";
		context.fillRect(10, 10, 55, 50);
		
		// Draw a 45x40 transparent blue rectangle at (30, 30)
		context.fillStyle = "rgba(0, 0, 200, 0.5)";
		context.fillRect(30, 30, 55, 50);
		*/
		
		// Open a new path
		context.beginPath();
		
		// Set the first point (a path starts with no points)
		context.moveTo(75, 50);
		
		// Create from the first point to the specified point
		context.lineTo(80, 55);
		
		// Create a line from the second point to the last point
		// to create the full triangle shape
		context.lineTo(80, 45);
		
		// Set the fill color to a partially transparent Android blue
		context.fillStyle = "rgba(51, 181, 229, 0.5)";
		
		// Close and fill the triangle with the fill style specified above
		context.fill();
		
		// Create the arc that will connect to the arrow
		// (and create the entire refresh symbol)
		context.beginPath();
	
		context.arc(85, 57, 10, -(Math.PI / 1.5), -Math.PI);
		
		//context.lineWidth(5);
		context.stroke();
		
		
		
		
		
	}
	
	window.onload = draw;
	
};

// Invoke the module
practice.init();
