(function() {
    var socket = io();
    var totalClickCounter = 0;
    var accumulatorArrayA0 = [0,0,0,0,0,0,0,0,0,0,0];
    var accumulatorArrayA1 = [0,0,0,0,0,0,0,0,0,0,0];
    var margin = {top:20, right: 20, bottom: 40, left: 40};
    var width = 480 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand()
            .range([0, width], .1)
            .padding(0.1);
    
    var y = d3.scaleLinear()
            .range([height, 0]);

    var bars = d3.select("#bar-chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    bars.selectAll(".bar")
        .data(accumulatorArrayA0)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => x(i))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d))
        .attr("height", d => height - y(d));

    bars.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    bars.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y).ticks(0));

    bars.append("text")
        .attr("transform", "translate(" + (width/2) + "," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("score");

    bars.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("frequency");

    socket.on("bar-data", (data) => {
        var current = data.dataKey;
        var svgBar = document.getElementById(current);
        var newWidth = data.dataString * 40;
        svgBar.setAttribute("width", newWidth);
        currentInputValue(data);
        addRemoveClass("add");
    });
    
    socket.on("button-data", (data) => {
        var percentageSpan = document.getElementById('percent');
        totalClickCounter += 2;
        accumulatorArrayA0[data[0]] += 1;
        accumulatorArrayA1[data[1]] += 1;

        var positiveTotal1 = sumPositiveResponse(accumulatorArrayA0);
        var positiveTotal2 = sumPositiveResponse(accumulatorArrayA1);

        var positiveTotals = positiveTotal1 + positiveTotal2;
        var positivePercentage = (positiveTotals / totalClickCounter) * 100;
        var positivePercentage = Math.floor(positivePercentage);
        percentageSpan.innerHTML = positivePercentage;
        socket.emit('percentData', positivePercentage);

        updateBar(accumulatorArrayA0);

        addRemoveClass("remove");
    });
    
    function updateBar(data) {
        x.domain(d3.range(data.length));
        y.domain([0, d3.max(data)]);
        var rect = bars.selectAll(".bar").data(data);

        rect.enter().append("rect");
        rect.attr("class", "bar")
            .transition()
            .duration(1000)
            .attr("x", (d, i) => x(i))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d))
            .attr("height", d => height - y(+d));

        bars.select(".x.axis")
            .transition()
            .duration(1000)
            .call(d3.axisBottom(x));
        bars.select(".y.axis")
            .transition()
            .duration(1000)
            .call(d3.axisLeft(y).ticks(d3.max(data)).tickFormat(d3.format("d")));
    }

    function sumPositiveResponse(dataArray) {
        var positiveTotal = 0;
        for (var i = 5; i < dataArray.length; i++) {
            positiveTotal += dataArray[i];
        }
        return positiveTotal;
    }

    function addRemoveClass(action) {
        var buttonResponse = document.getElementById("bar-A0").getElementsByClassName("text-block-response")[0];
        buttonResponse.classList[action]("hidden");
        buttonResponse = document.getElementById("bar-A1").getElementsByClassName("text-block-response")[0];
        buttonResponse.classList[action]("hidden");
    };

    function currentInputValue(data) {
        var targetP = document.getElementById("bar-" + data.dataKey)
            .getElementsByClassName("text-block")[0]
            .getElementsByTagName("p")[0];
        targetP.innerHTML = data.dataString;
    }
})();