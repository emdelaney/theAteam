/**
 * data-controller.js
 *
 * Defines the applications functionality for fetching and transforming
 * data from the Google Fusion Table containing the GSS data
 *
 * File based on Dr. Crenshaw's NYT data controller
 *
 * @author Matthew Young
 * @date 1 March 2015
 *
 *
 */
// Extend the namespace
var maverick = maverick || {};
maverick.data = {};

// The intention of this approach is to be framework-agnostic
// and to avoid namespace pollution by encapsulating the contents of 
// this module in a function:
maverick.data = function() {

    var apikey = "AIzaSyD2-nGM_SdBXqPVzFhkh_h1eFmWLpu39CM";
    var keyParam = "&key=" + apikey;
    var gssTableID = "14d34mgfXGR9tJWvqJu2v4C91RdZaxNpjdk4yw2iB";
    var queryURL = "https://www.googleapis.com/fusiontables/v1/query?sql=";
	
	var cache = []; // Cache retrieved results to make later accesses faster
	
	

    // ************************************************************************
    // Methods local to this module.
    // ************************************************************************

    /** 
     * makeHttpObject()
     * 
     * Based on the example offered in Chapter 14 of Eloquent
     * JavaScript by Marjin Haverbeke, this function is a browser
     * agnostic and framework agnostic wrapper for creating an http
     * object in JavaScript.
     *
     */
    var makeHttpObject = function() {
        try {
            return new XMLHttpRequest();
        } catch (error) {}
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (error) {}
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (error) {}

        throw new Error("Could not create HTTP request object.");
    };

    // ************************************************************************
    // Methods provided by this module, visible via the namespace.
    // ************************************************************************

    /** 
     * request()
     *
     * Based on the example offered in Chapter 14 of Eloquent JavaScript by
     * Marjin Haverbeke, this function leverages the makeHttpObject call
     * to make an http request.
     *
	 * callback is the function to be called once the request is complete. It should take an object as a parameter,
	 * which will be a hashtable linking categories to percentages
	 * 
	 *
     * The year parameter corresponds to the year you want data for. The other parameters should be booleans
     * indicating whether or not to include those results in the returned value (true = include). If an entire category
     * is set to false it will be set to true.
     *
     */
    maverick.data.request = function(callback, year, varName, male, female, stRep, nStRep, ind, nStDem, stDem, other, decAns) {
		
		var stringRep = year + "" + varName + "" + male + "" + female + "" + stRep + "" + nStRep + "" + ind + "" + nStDem + "" + stDem + "" + other + "" + decAns;
		
		if (!(typeof cache[stringRep]  === "undefined")){
			// We've done this before. No need to do a whole new lookup.
			callback(cache[stringRep]);
			return;			
		}

	
        // If no gender is selected or all genders are selected
        if (!(male || female) || (male && female)) {
            var genderQuery = "sex IN (1, 2)";
        }
		else if (male){
			var genderQuery = "sex = 1";
		}
		else{ // female
			var genderQuery = "sex = 2";
		}

		
        // Because political association has more options, we need to do something fancier to maintain sanity
        if (!(stRep || nStRep || ind || nStDem || stDem || other || decAns)) {
            stRep = nStRep = ind = nStDem = stDem = other = decAns = true;
        }

		var allowedParties = [];
		
		if (stDem){
			allowedParties.push(0);
		}
		if (nStDem){
			allowedParties.push(1);
		}
		if(ind){
			allowedParties.push(2, 3, 4); // Lumping all independents regardless of leaning into one category
		}
		if (nStRep){
			allowedParties.push(5);
		}
		if(stRep){
			allowedParties.push(6);
		}
		if(other){
			allowedParties.push(7);
		}
		if(decAns){
			allowedParties.push(8);
		}
		
		var politicalQuery = "partyid IN (" + allowedParties.join() + ")";
		
		
		// Filter out respondents who were not asked the question or gave no valid response
		var validResponsesOnly = varName + " NOT IN (0, 8, 9)";


        // Make a new request.
        var r = makeHttpObject();
        if (r) {

            var url = queryURL + "SELECT " + varName + " FROM " + gssTableID +
			" WHERE year=" + "'" + year + "' AND " + genderQuery + " AND " + politicalQuery + " AND " + validResponsesOnly + keyParam;
            // Construct the details of the credentialed request and send it.
            r.open("GET", url, true);

            // Alter the onreadystatchange property of the object to a
            // function that will be called every time the state changes.
            // If the state is '4' -- the document has been fully loaded.
            r.onreadystatechange = function(evtXHR) {
                if (r.readyState == 4) {
                    if (r.status == 200) {

                        // Convert the string response into JSON format. Extract rows.
                        var responses = JSON.parse(r.responseText).rows;
												
						// Taken from part 18 of Dr. Crenshaw's JavaScript Functions and Methods Study Guide
						var flatResponses = responses.reduce(function (target, element) { return target.concat(element); }, []);	
						
						
						// Begin statistical computation
						var numResponses = flatResponses.length;
						
						// Discover and count totals
						var totals = [];
						for(var i = 0; i < numResponses; ++i){
							if (typeof totals[flatResponses[i]] === "undefined"){
								totals[flatResponses[i]] = 1;
							}
							else{
								++totals[flatResponses[i]];
							}
						}
						
						var percentages = [];
						
						for (var t of totals.keys()){ // This for-each loop will only work on Chrome 38 or newer!!!
							percentages[t] = totals[t] / numResponses;
						}												
						
						// Relate the percentages to their names. For now this is hard-coded, and this is fine for 2 data sets.
						// If we expand to more later we can automate this process based on conversion tables.						
						if ("fehelp" == varName){
							var feReturn = [];
							feReturn["Strongly Agree"]    = percentages[1];
							feReturn["Agree"]             = percentages[2];
							feReturn["Disagree"]          = percentages[3];
							feReturn["Strongly Disagree"] = percentages[4];
							cache[stringRep] = feReturn;
							callback(feReturn);
						}
						else if ("homosex" == varName){
							var hoReturn = [];
							hoReturn["Always Wrong"]        = percentages[1];
							hoReturn["Almost Always Wrong"] = percentages[2];
							hoReturn["Sometimes Wrong"]     = percentages[3];
							hoReturn["Not Wrong at All"]    = percentages[4];
							cache[stringRep] = hoReturn;
							callback(hoReturn);
						}
						else{
							alert("Unsupported variable name " + varName + " used. Returning raw numeric names.");
							cache[stringRep] = percentages;
							callback(percentages);
						}
						
                    }
                }
            }
            r.send();
        }
    };


}; // end maverick.data-ctrl module

// Invoke module.
maverick.data();