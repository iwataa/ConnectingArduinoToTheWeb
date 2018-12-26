(function() {
    var socket = io();
    socket.on("bar-data", (data) => {
        var current = data.dataKey;
        var svgBar = document.getElementById(current);
        var newWidth = data.dataString * 40;
        svgBar.setAttribute("width", newWidth);
        currentInputValue(data);
        addRemoveClass("add");
    });
    
    socket.on("button-data", (data) => {
        addRemoveClass("remove");
    });
    
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