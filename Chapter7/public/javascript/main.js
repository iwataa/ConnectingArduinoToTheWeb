(function() {
    var socket = io();
    var totalClickCounter = 0;
    var accumulatorArrayA0 = [0,0,0,0,0,0,0,0,0,0,0];
    var accumulatorArrayA1 = [0,0,0,0,0,0,0,0,0,0,0];

    BarChart.setup(accumulatorArrayA0);

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

        BarChart.updateBar(accumulatorArrayA0);

        addRemoveClass("remove");
    });

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