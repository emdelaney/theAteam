/* 
 * Javascript file for the view/controller, mostly for manipulating
 * the canvas element (graph) and the play/pause button.
 * A namespace is used to avoid polluting the global namespace.
 */

var maverick = maverick || {};
maverick.init = {};

// Implement this module for the maverick namespace
maverick.init = function() {
	
	var test_data = [6.7, 36.3, 43.2, 13.8];
	var colors = ["rgba(255,0,0,0.5)", "rgba(0,255,0,0.5)", "rgba(0,0,255,0.5)",
					  "rgba(255,255,0,0.5)", "rgba(255,0,255,0.5)"];
	var canvas;
	var context;
	var highest;
	
	function draw() {
		// Getting the context for the Canvas on the screen
		canvas = document.getElementById("graph_canvas");
		context = canvas.getContext("2d");
		
		draw_axes();
		draw_scales();
		draw_bars();
	}
	
	function draw_axes() {
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
		
		if(Math.max.apply(null, test_data) > 50.0) {
			highest = 100.0;
		}
		else {
			highest = 50.0;
		}
		
		// Make this less "hardcoded"
		for(var i = 4; i >= 0; i--) {
			context.beginPath();
			context.moveTo(40, (i * 65) + 20);
			context.lineTo(50, (i * 65) + 20);
			context.fillStyle = "rgb(0,0,0)";
			context.stroke();
		}
	}
	
	// Draw the numbers that label the y-axis;
	// the highest number will differ based on
	// the maximum value being visualized (currently
	// only changes between 50 and 100 for the maximum)
	function draw_scales() {
		var scale = ~~highest;
		var temp = scale;
		var scales = [];
		while(temp >= 0) {
			scales.push(temp);
			temp = temp - (scale/5);
		}
		
		context.font = "14px Arial";
		scales.forEach(function(el, index) {
			context.fillText("" + el, 10, (index * 65) + 20);
		});
	}
	
	// Draw the bars that visualize the data onto the canvas element
	function draw_bars() {
		
		test_data.forEach(function(el, index) {
			var top = 20 + ((highest - el) * 325/highest);
			var height = 343 - top;
			var left = 55 + (index * 106);
			
			context.fillStyle = colors[index];
			context.fillRect(left, top, 106, height);
		});
	}
	
	window.onload = draw;
	
};

// Invoke the module
maverick.init();
