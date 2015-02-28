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
	var colors = ["rgba(0,95,107,1.0)", "rgba(0,140,158,1.0)", "rgba(0,180,204,1.0)",
					  "rgba(0,223,252,1.0)"];
	var axes_color = "rgb(150,150,150)";
	var canvas;
	var context;
	var highest;
	
	var pause_url = "img/pause.png";
	var play_url = "img/play.png";
	var button_url = "img/pause.png";
	var play_displayed = true;
	
	function init_gui() {
		draw();
		handler_setup();
	}
	
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
		context.strokeStyle = axes_color;
		
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
			context.strokeStyle = axes_color;
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
		context.fillStyle = axes_color;
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
	
	function handler_setup() {
		var button = document.getElementById("play_button");
	
		button.onclick = function() {
			button.setAttribute("src", button_url);
			if(play_displayed) {
				button_url = play_url;
				play_displayed = false;
			}
			else {
				button_url = pause_url;
				play_displayed = true;
			}
		};
	}
	
	window.onload = init_gui;
	
};
	
// Invoke the module
maverick.init();
