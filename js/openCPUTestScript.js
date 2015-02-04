ocpu.seturl("https://public.opencpu.org/ocpu/library/graphics/R");


$("#beginButton").on("click", function(){

	//disable the button to prevent multiple clicks
    $("#beginButton").attr("disabled", "disabled");
	
	var i = 0;
	var heights = [1,2,3,4,5];

	// Send a request to the OpenCPU public server to execute
	// the R function barplot() and return the graphic 10 times
	var interval = setInterval(function(values){
		plotter();
	}, 1000);
	
	function plotter(){
	
		var req = $("#plotdiv").rplot("barplot", {
			height: heights,
			width: 1,
			xlab: "Test Label",
			ylim: [0,16]
		});
		
		//heights.map(function(num){ num++; });
		//console.log(heights[0]);
		heights[0]++;
		heights[1]++;
		heights[2]++;
		heights[3]++;
		heights[4]++;
		
		i++;
		if(i >= 10){
			clearInterval(interval);
		}
		
		//if R returns an error, alert the error message
		req.fail(function(){
		  alert("Server error: " + req.responseText);
		});
		
		//after request complete, re-enable the button 
		req.always(function(){
		  $("#beginButton").removeAttr("disabled");
		});
	}
	
});