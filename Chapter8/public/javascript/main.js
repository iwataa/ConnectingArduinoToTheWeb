(function() {
    var socket = io();
    var temperature = new DonutChart();
    temperature.setSensorDomain([-6, 50]);
    temperature.setSvgDiv("#donut1");
    temperature.createChart('\u00B0' + "c", "temp");

    var humidity = new DonutChart();
    humidity.setSensorDomain([0, 100]);
    humidity.setSvgDiv("#donut2");
    humidity.createChart('\u0025', "humidity");

    var light = new DonutChart();
    light.setSensorDomain([0, 10]);
    light.setSvgDiv("#donut3");
    light.createChart('', "light");

    socket.on("initial-data", function(data) {
	console.log(data);
	temperature.updateChart(data.temp.current);
	humidity.updateChart(data.humidity.current);
	light.updateChart(data.light.current);
    });

    socket.on("data", function(data) {
	console.log(data);
	temperature.updateChart(data.temp.current);
	humidity.updateChart(data.humidity.current);
	light.updateChart(data.light.current);
    });
})();
