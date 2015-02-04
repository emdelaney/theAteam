ocpu.seturl("https://public.opencpu.org/ocpu/library/graphics/R");
$("#beginButton").on("click", function(){

	//disable the button to prevent multiple clicks
    $("#beginButton").attr("disabled", "disabled");
	
	// A test vector for displaying a bar plot
	var heights = [1,2,3,4,5];
	
	// Send a request to the OpenCPU public server to execute
	// the R function barplot() and return the graphic
	var req = $("#plotdiv").rplot("barplot", {
		height: heights,
		width: 1,
		xlab: "Test Label"
	});
	
	//var req = $("#plotdiv").rplot("smoothplot", {
	//	ticker: "GOOG",
	//	from : "2013-01-01" 
	//});
	
	//if R returns an error, alert the error message
	req.fail(function(){
	  alert("Server error: " + req.responseText);
	});
	
	//after request complete, re-enable the button 
	req.always(function(){
	  $("#beginButton").removeAttr("disabled");
	});
});