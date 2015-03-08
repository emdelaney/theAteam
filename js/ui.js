/*
 * JavaScript File: ui.js
 * Author: Daniel Ehmig
 * Date: 2 March 2015
 * Purpose: The purpose of the module implemented in this
 * js file is to draw/manipulate the graph canvas and handle
 * events from button clicks on the web front-end.
 */
 
// Open up the project's namespace
var maverick = maverick || {};

// Add the user interface module to the namespace
maverick.ui = {};

// Define the interface module, encapsulating all of its variables
// and objects to avoid polluting the global namespace
maverick.ui = function() {
	
	// This object will be contain the current values for
	// each bar of the graph; usually will change often
	var displayed_data = {
		"Strongly Agree": 	 13.8,
		"Agree": 			 43.2,
		"Disagree": 		 36.3,
		"Strongly Disagree": 6.7
	};

	var filters =
        {
            "female": false,
            "male": false,
            "strong republican": false,
            "not strong republican": false,
            "independent": false,
            "not strong democrat": false,
            "strong democrat": false,
            "other": false,
            "did not answer": false
        }
 
	
	// Define some meta-data about the datasets to use; these objects
	// are mostly used to populate the drop-down menus
	/*
	*	-->Initial dataset displayed is just the first in the list<--
	*/
	var datasets = {
		fehelp: {
			var_name: "Wife Should Help Husbands Career First", 
			years: [1977,1985,1986,1988,1989,1990,1991,1993,1994,1996,1998],
			labels: ["Strongly<br>Disagree", "Disagree", "Agree", "Strongly<br>Agree"]
		}, 
		homosex: {
			var_name: "Homosexual Sex Relations",
			years: [1973,1974,1976,1977,1980,1982,1984,1985,1987,1988,
					1989,1990,1991,1993,1994,1996,1998,2000,2002,2004,2006],
			labels: ["Not Wrong<br>at All", "Sometimes<br>Wrong", 
						"Almost<br>Always<br>Wrong", "Always<br>Wrong"]
		}
	};
	
	var current_set;
	
	// This object contains all of the properties for the graph
	// canvas object, including colors, dimensions, etc
	var graph_properties = {
		colors: {			
			"Strongly Disagree": "rgba(0,95,107,1.0)",
			"Disagree":  "rgba(0,140,158,1.0)",
			"Agree":  "rgba(0,180,204,1.0)",
			"Strongly Agree": "rgba(0,223,252,1.0)",
			"Always Wrong": "rgba(225,227,172,1.0)",
			"Almost Always Wrong":  "rgba(166,185,133,1.0)",
			"Sometimes Wrong":  "rgba(100,138,100,1.0)",
			"Not Wrong at All": "rgba(70,104,91,1.0)"
		},
		axes_color: "rgb(150,150,150)",
		top_gap:	20, // the number of pixels between top of graph and top of canvas
		dist_between_scales: 0, // set later in the code
		num_divisions: 5,
		highest: 50.0, // The largest scale that will be displayed on the y-axis
		font: "14px Arial",
		bar_width: 106 // Determined by 'trial and error'
	};
	
	// This object contains all of the image urls for the play/pause button
	var button_urls = {
		pause: "img/pause.png",
		play: "img/play.png",
		play_hover: "img/play_hover.png",
		pause_hover: "img/pause_hover.png",
		next: "img/pause_hover.png"
	};
	
	// Variables we need to refer to throughout the code to 
	// draw onto the graph canvas
	var canvas;
	var context;
	var clean_slate;
	var play_pause_button;
	var year_menu;
	var animation = {
	    frames_per_year: 60
	}
	
	// Whether the play button is currently displayed rather than the pause
	var currently_paused = true;
	var current_year = 1977;
	
	// Just a wrapper function that calls other initialization
	// functions when the window has loaded
	function init() {
	
		// Set up drawing on the graph canvas
		canvas = document.getElementById("graph_canvas");
		context = canvas.getContext("2d");
		play_pause_button = document.getElementById("play_button");
		year_menu = document.getElementById("year_menu");
		draw();
		handler_setup();
		populate_menus();
	}
	
	// Driver function that sets up the initial bar graph with its
	// axes, scale markers, and the bars for the initial data
	function draw() {
		
		// How far apart the scales are apart from each other
		graph_properties.dist_between_scales = 
			(canvas.height - graph_properties.top_gap - 5)/graph_properties.num_divisions;
			
		draw_axes();
		draw_scales();
		draw_bars();
	}
	
	// This function simply draws the x and y-axes on the graph
	function draw_axes() {
		// Open the path to start drawing
		context.beginPath();
		
		// Start the path at the top of the y-axis
		context.moveTo(40, graph_properties.top_gap);
		
		// Draw the rest of the path
		context.lineTo(40, 344);
		context.lineTo(490, 344);
		context.lineTo(490, 339);
		
		// Set the color of the axes and slap 'em in
		context.strokeStyle = graph_properties.axes_color;
		context.stroke();
	}
	
	// This function draws the scale divisions and their corresponding values
	function draw_scales() {
		graph_properties.highest = find_highest();
		
		for(var i = graph_properties.num_divisions - 1; i >=0; --i) {
			draw_mark(i);
		}
		
		draw_nums();
	}
	
	// Draw bars on the graph corresponding to the current response data
	function draw_bars() {
	
		// Convenience shorthand
		var g = graph_properties;
		
		// Keep an index so we know where to start drawing the bar
		var i = 3;
		for(var key in displayed_data) {
			
			// set up the dimensions of the bar
			var top = g.top_gap + ((g.highest - displayed_data[key]) * 
				(g.num_divisions * g.dist_between_scales)/g.highest);
			
			// 343 obtained with 'trial and error' observations
			var height = 343 - top;
			
			// 55 obtained with 'trial and error' observations
			var left = 55 + (i * g.bar_width);
			
			context.fillStyle = graph_properties.colors[key];
			context.fillRect(left, top, g.bar_width, height);
			i--;
		}
	}
	
	// Function that sets up function callbacks
	// for the play/pause button and the filter buttons
	function handler_setup() {
		
		// Just alternate between play and pause
		// button when user clicks for now
		play_pause_button.onclick = function() {
			// Alternate between the highlighted buttons because
			// the image changes to un-highlighted when
			// the mouse exits the element
			if (currently_paused) {
                // pushing the PLAY button.
				start_animation();
			}
			else {
                // pushing the PAUSE button.
				pause_animation();
			}
		};
		
		// When the mouse hovers over the button,
		// highlight the button accordingly
		play_pause_button.onmouseover = function() {
			if(currently_paused) {
				play_pause_button.setAttribute("src", button_urls.play_hover);
			}
			else {
				play_pause_button.setAttribute("src", button_urls.pause_hover);
			}
		};
		
		// Make sure the button isn't highlighted anymore
		// when the mouse exits the element
		play_pause_button.onmouseout = function() {
			if(currently_paused) {
				play_pause_button.setAttribute("src", button_urls.play);
			}
			else {
				play_pause_button.setAttribute("src", button_urls.pause);
			}
		};
        // Set up gender filters
		var fem = document.getElementById("female_filter");
		fem.onclick = function () { toggle_filter("female", fem); };
		var male = document.getElementById("male_filter");
		male.onclick = function () { toggle_filter("male", male); };
        // Set up political filters
		var sr = document.getElementById("strong_republican_filter");
		sr.onclick = function () { toggle_filter("strong republican", sr); };
		var nsr = document.getElementById("not_strong_republican_filter");
		nsr.onclick = function () { toggle_filter("not strong republican", nsr); };
		var indep = document.getElementById("independent_filter");
		indep.onclick = function () { toggle_filter("independent", indep); };
		var sd = document.getElementById("strong_democrat_filter");
		sd.onclick = function () { toggle_filter("strong democrat", sd); };
		var nsd = document.getElementById("not_strong_democrat_filter");
		nsd.onclick = function () { toggle_filter("not strong democrat", nsd); };
		var oth = document.getElementById("other_filter");
		oth.onclick = function () { toggle_filter("other", oth); };
		var dta = document.getElementById("did_not_answer_filter");
		dta.onclick = function () { toggle_filter("did not answer", dta); };

	}

    // function to toggle a specific filter value.
	function toggle_filter(filter, element)
	{
        // If we're deselecting the filter:
	    if(filters[filter])
	    {
	        filters[filter] = false;
	        element.setAttribute("class", "fil_but");
	    }
	    else
        // We're selecting a filter.
	    {
	        filters[filter] = true;
	        element.setAttribute("class", "fil_but_selected");
	    }
        // Ask for a filtered data set and re-draw.
	    filter_change();
	}
	
	// Function to programmatically add DOM elements to the dataset
	// drop-down menu and the dataset drop-down menu
	function populate_menus() {
		var set_menu = document.getElementById("dataset_menu");
		
		// Make sure we actually have some datasets
		if(datasets) {
		
			// A little trick to grab the first element in the object
			for(var key in datasets) break;
			
			current_set = key;
			
			if(datasets[key].years) {
				pop_years(key);
			}
			
			for(var key2 in datasets) {
				var set = document.createElement("option");
				set.setAttribute("value", datasets[key2].var_name);
				var text = document.createTextNode(datasets[key2].var_name);
				set.appendChild(text);
				dataset_menu.appendChild(set);
			}
		}
		
		
		
		year_menu.onchange = function() {
			year_change(this.value);
		};
		
		dataset_menu.onchange = function() {
			dataset_change(this.value);
		};
	}
	
	// Callback function when the user selects a new year
	// in the year drop-down menu
	function year_change(year) {
	    current_year = year;
		// Invoke the data-controller!
		maverick.data.request(query_callback, year, current_set, false, false,
								false, false, false, false, false, false, false);
	}

    // Function to re-request data when the filter state changes.
	function filter_change()
	{
	    maverick.data.request(query_callback, current_year, current_set, filters["female"],
            filters["male"], filters["strong republican"], filters["not strong republican"],
            filters["independent"], filters["not strong democrat"], 
            filters["strong democrat"], filters["other"], filters["did not answer"]);
	}
	
	// Callback function that the data-controller calls when
	// it is done querying the fusion table
	function query_callback(data) {

		for(var key in data) {
			if(data[key] <= 1.0) {
				data[key] *= 100;
			}
		}
		
		displayed_data = data;
		
		console.log(data);
		// Clean the canvas slate
		context.clearRect(0, 0, canvas.width, canvas.height);
		draw();
	}
	
	// Callback function when the user selects a new dataset
	// from the dataset drop-down menu
	function dataset_change(set) {
		
	    pause_animation();
		// First, we find which dataset was selected
		for(var key in datasets) {
			if(datasets[key].var_name === set) {
				var menu = document.getElementById("year_menu");
				menu.innerHTML = "";
				
				pop_years(key);
				
				current_set = key;
				
				// We have to query the data to draw the graph
				// for the new dataset
				year_change(datasets[key].years[0]);
				
				// We also need to change the labels on the graph
				var lbls = datasets[key].labels;
				//document.getElementsByClassName("first_label")[0].replaceChild(document.createTextNode(lbls[0]));
				var first_label = document.getElementsByClassName("first_label")[0];
				first_label.innerHTML = lbls[0];
				
				var rest = document.getElementsByClassName("x_label");
				for(var i = 1; i < lbls.length; i++)
				{
					rest[i-1].innerHTML = lbls[i];
				}
				break;
			}
		}
	}
	
	// Determine the maximum scale value
	function find_highest() {
		var top = 0.0;
		
		// Iterate through the response data to find the largest
		for (var key in displayed_data) {
			if(displayed_data[key] > top) {
				top = displayed_data[key];
			}
		}	
		
		// Set top scale value based on largest response value
		if (top > 50.0) {
			return 100.0;
		}
		else {
            //TODO: For now, always return 100 so the animation doesn't do weird stuff.
			return 100.0;
		}
	}
	
	// Helper function to populate the year menu, with the given dataset
	function pop_years(key) {
		for(var i = 0; i < datasets[key].years.length; ++i) {
			var year = document.createElement("option");
			year.setAttribute("value", datasets[key].years[i]);
			var text = document.createTextNode(datasets[key].years[i]);
			year.appendChild(text);
			year_menu.appendChild(year);
		}
	}
	
	// Draw a single 'tick' mark on the y-axis indicating a scale division
	function draw_mark(num) {
		var g = graph_properties;
		context.beginPath();
		context.moveTo(40, (num * g.dist_between_scales) + g.top_gap);
		context.lineTo(50, (num * g.dist_between_scales) + g.top_gap);
		context.strokeStyle = g.axes_color;
		context.stroke();
	}
	
	// Draw each scale number on the y-axis
	function draw_nums() {
		// Convenience object to save typing
		var g = graph_properties;
		
		// Fill in a temp list of the scale nums that will be drawn
		// --> depends on highest scale value computed earlier
		var scale = ~~g.highest;
		var temp = scale;
		var scales = [];
		while(temp >= 0) {
			scales.push(temp);
			temp = temp - (scale/g.num_divisions);
		}
		
		// Draw the scale numbers from the preceding temp list
		context.font = g.font;
		context.fillStyle = g.axes_color;
		scales.forEach(function(el, index) {
			context.fillText("" + el, 10, (index * g.dist_between_scales) + g.top_gap);
		});
	}
	
	// Only call the function when the page is loaded
	window.onload = init;

	function pause_animation()
	{
	    play_pause_button.setAttribute("src", button_urls.play);
	    button_urls.next = button_urls.pause_hover;
	    currently_paused = true;
	}

	function start_animation()
	{
	    play_pause_button.setAttribute("src", button_urls.pause);
	    button_urls.next = button_urls.play_hover;
	    currently_paused = false;
	    setTimeout(animate_next_bar, 500);
	}

    // Hacked together for now, simply changing the year.
    // TODO: use window.requestAnimationFrame
	// to make the animations smoother eventually.
	function animate_next_bar()
	{
	    if (!currently_paused)
	    {
	        var idx = datasets[current_set].years.lastIndexOf(current_year);
	        if (idx == datasets[current_set].years.length - 1)
	        {
	            pause_animation();
	        }
	        else
	        {
	            year_menu.selectedIndex = idx + 1;
	            year_change(datasets[current_set].years[idx + 1]);
	            setTimeout(animate_next_bar, 1000);
	        }
	    }
	}
};
 
maverick.ui();