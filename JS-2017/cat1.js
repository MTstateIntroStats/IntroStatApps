 // subroutine to estimate a proportion or test for a special value
 // Inputs: 
 //     2 category labels (default = Success/Failure) and a count for each 
 // Test routine needs a null hypothesis value
 
    var c1SummDiv = d3.select("#cat1Inference"),
        cat1Label1,
        cat1Label2,
        cat1N1,
        cat1N2,
        c1Data = [],
        c1bars ,
        chartC1 ,
        confLevels = [
			{ key: "80%", value: "0.80" },
			{ key: "90%", value: "0.90" },
			{ key: "95%", value: "0.95" },
			{ key: "99%", value: "0.99" }
		], 
		cnfLvl,
		c1Inference,
		c1InfOutput,
		muNull,
        phat,
        resampleC1,
        sampleC1,
        total;

 var svgCat1 = d3.select("#cat1InfSVG");      
     // .attr("width",  '400px')
     // .attr("height", '300px')
     // .append("g");
               
function summarizeP1() {
      // builds summary table and plot for 1 categorical variable
	var margin = 30, 
    	barHeight = 20,  
        colors = [],
        w = 300,  
        h = 60,  
        
        x = d3.scale.linear()
         .domain([0, 1])
         .range([14, w - margin*2]);

	  var xAxis = d3.svg.axis()
    	.scale(x)
    	.ticks(5)
    	.orient("bottom");
      
      cat1Label1 = document.getElementById("cat1Label1").value;
      cat1Label2 = document.getElementById("cat1Label2").value;
      cat1N1 = +document.getElementById("cat1N1").value;
      cat1N2 = +document.getElementById("cat1N2").value;
      phat = cat1N1/ (cat1N1 + cat1N2);
      cat1Summ = document.getElementById("cat1SummaryText");
      c1Data = [{"label": cat1Label1, "xx": phat},
      			{"label": cat1Label2, "xx": 1-phat}];
      cat1Summ.innerHTML = "p&#770; =  " + phat.toPrecision(5) +" <br> sd(p&#770) = " + 
                (Math.sqrt(phat*(1-phat))/(cat1N1+cat1N2)).toPrecision(5);
      cat1Summ.style = "display: block"; 
    
    //if(chartC1 === "a"){
     //}

	function updateP1(chart, data) {
  		// DATA JOIN
  		var bars = chart.selectAll("rect")
    		.data(data);
	  	// UPDATE
   		bars.enter().append("g")
        	.attr("fill", "blue")
        	.attr("transform", function(d, i) { return "translate(14," + i * barHeight + ")"; });
	    bars.append("rect")
    	  .attr("width", function(d){return x(d.xx ) - 14;} )
    	  .attr("height", barHeight -1);

 	  // EXIT
  		// Remove old elements as needed.
 	 	bars.exit().remove();
	}
   	if(!chartC1){
	    chartC1 = d3.select(".chart")
    	  .attr("width", w + margin*2)
      		.attr("height", h + margin);
     } else{
     		var oldbars = chartC1.selectAll("g").data(c1Data);
     		oldbars.remove();
     		//var oldtxt = chartC1.selectAll("text").data(c1Data);
     		//oldtxt.remove();
     }
   // adding axis throws off the bar heights and doesn't allow nice updates.
   // TODO: use an unfilled rectangle instead??
    
    barC1 = chartC1.selectAll("g")
      .data(c1Data);
     barC1.enter().append("g")
        //.attr("fill", "blue")
        //.attr("transform", function(d, i) { return "translate(14," + i * barHeight + ")"; })
	    .each(function(d) {this._current = d;} );
	    //resets the figure to the current data
    
	  barC1.append("rect")
    	.attr("width", function(d){return x(d.xx );})// - 14;} )
    	.attr("height", barHeight -1)
        .attr("fill", "blue")
        .attr("transform", function(d, i) { return "translate(14," + i * barHeight + ")"; });
    
  	  barC1.append("text")
 		.attr("x",  function(d){return 16 + x(d.xx) ;})
 		.attr("y", function(d, i) { return (i+.5) * barHeight;})
 		.attr("dy", ".35em")
 		.text(function(d) {return d.label}) 
        .attr("fill", "blue");	
}
	
	function onChange(arg) {
		cnfLvl = arg.value
		console.log(cnfLvl)
	}
	
var cat1hdr,
	cat1CLvl;

var rangeslide2 = rangeslide("#cat1ConfLvl", {
		data: confLevels,
		showLabels: true,
		startPosition: 0,
		showTicks: false,
        dataSource: "value",
        labelsContent: "key",
        valueIndicatorContent: "key",
		thumbWidth: 24,
		thumbHeight: 24,
		handlers: {
			"valueChanged": [onChange]
		}
	});
	
  
function estimateP1(){
	//function to estimate the true proportion based on a sample of 'success/failure' data
	// Gather Inputs:
      cat1Label1 = document.getElementById("cat1Label1").value;
      cat1Label2 = document.getElementById("cat1Label2").value;
      cat1N1 = +document.getElementById("cat1N1").value;
      cat1N2 = +document.getElementById("cat1N2").value;
      var sC1Len,
      	  total = cat1N1 + cat1N2;
      phat = cat1N1/ total;

	 cat1hdr = document.getElementById("cat1OutputHead1");
	 cat1hdr.innerHTML = "Choose a Confidence Level"+ 
	 "<h4>Estimate True Proportion with a Confidence Interval</h4>"+
	 "&nbsp; &nbsp; &nbsp; &nbsp; Proportion "+ cat1Label1 +" in Re-samples"; 
 	  cat1CLvl = document.getElementById("cat1ConfLvl");
	  cat1CLvl.style.display ="";
	 // show plot
	 
	  resampleC1 = rbinom(total, phat, 1000);
	  sC1Len = resampleC1.length;
	  for(i=0; i < sC1Len; i++){
	      resampleC1[i] *= 1/total;
	  } 
	 return(resampleC1);		
	 // TODO  
	   // this goes into discrete plot with output saved as infOutput.
	   // Now need another function to allow interaction:
	 // click buttons for more re-samples
	 // plot:
	   // sort resampled phats and find appropriate quantiles:
	     // [alpha/2, 1 - alpha/2] where alpha = 1- confLevel
	   // change point colors based on in/outside the CI
	     // to change colors, we need to build sample as an array with a color attribute
	     // do we need (x,y) coordinates to use for 'click to see the underlying sample'?
	       //  or can we use onclick on each circle?
	 //print CI
	
} 	  
 
 

function testP1(){
	//function to test 'Is the true proportion  = some value?' for 'success/failure' data
	// Gather Inputs:
      cat1Label1 = document.getElementById("cat1Label1").value;
      cat1Label2 = document.getElementById("cat1Label2").value;
      cat1N1 = +document.getElementById("cat1N1").value;
      cat1N2 = +document.getElementById("cat1N2").value;
      muNull = 0.5;
      var sC1Len,
      	  total = cat1N1 + cat1N2;
      phat = cat1N1/ total;
	 // print header 'Proportions From Samples From the Null Distribution'
	   // by setting innerhtml for a selected header
	 cat1hdr = document.getElementById("cat1OutputHead1");
	 cat1hdr.innerHTML = "<h4>Test if True Proportion Equals a Particular Value</h4>"+
	 "&nbsp; &nbsp; &nbsp; Proportion "+ cat1Label1 +" in Samples from the Null Hypothesis";
	  if(cat1CLvl = document.getElementById("cat1ConfLvl")){
	  	cat1CLvl.style.display ="none";
	  	}
	 // show plot -- use same SVG for test and estimate
	 	sampleC1 = rbinom(total, muNull, 1000);
	 	sC1Len = sampleC1.length;
	  for(i=0; i < sC1Len; i++){
	      sampleC1[i] *= 1/total;
	  } 
	  discreteChart(sampleC1, svgCat1);

	 // click buttons for more samples -- same for both test and estimate
	 // choose bounds (less, greater, more extreme) and cutoff (phat)
	 // change point colors based on in/outside the bounds
	 // print p-value
	 // clicking a point changes a table to show that proportion
	return(sampleC1);
} 	  

function c1InteractWith(infOut){
	var sample = infOut[1],  // values
	    dots = infOut[0];    // circles on the chart
	dots.style("fill","steelblue");
}