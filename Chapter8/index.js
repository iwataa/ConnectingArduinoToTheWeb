// vim: sts=4 sw=4 si
const SERIALPORT_PATH = "/dev/ttyACM0";
const SERVER_PORT = 3000;

// Library
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var SerialPort = require('serialport');
var parser = new SerialPort.parsers.Readline();
var serialport = new SerialPort(SERIALPORT_PATH);
var schedule = require("node-schedule");

// Configuration
serialport.pipe(parser);

app.engine('ejs', require('ejs').__express);
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));

// Application data

var sensors = {
    temp: { current: 0, high: 0, low: 100, dataIndex:0 },
    humidity: { current: 0, high: 0, low: 100, dataIndex:1 },
    light: { current: 0, high: 0, low: 10, dataIndex:2 }
};

var changeDay = 0;

var j = schedule.scheduleJob("0 0 0 * * *", function() {
    console.log("reset");
    for (key in sensors) {
	if (sensors.hasOwnProperty(key)) {
	    sensors[key].current = 0;
	    sensors[key].high = 0;
	    sensors[key].low = 100;
	}
    }
    changeDay = 1;
});

// Routing

app.get('/', (req, res) => {
    res.render('index');
});

serialport.on('open', () => {
    console.log('serial port opened');
});

serialport.on('error', error => {
    console.log('serial port error');
    console.log(error);
    process.exit(1);
});

// Broadcasting sensor data when refresh is needed

parser.on("data", (data) => {
    data = data.replace(/(\r\n|\r|\n)/gm, "");
    var dataArray = data.split(",");
    var hasChanged = updateValues(dataArray);

    if (hasChanged != 0) {
	io.emit("data", sensors);
    }

    if (changeDay == 1) {
	changeDay = 0;
	io.emit("change-day", "true");
    }
});


io.on('connection', (socket) => {

    // Show messaage when connection established
    console.log('socket.io connected');
    socket.emit("initial-data", sensors);

    // Message for disconnect event
    socket.on('disconnect', () => {
        console.log('disconnected');
    });
});


server.listen(SERVER_PORT, () => {
    console.log('listening on port ' + SERVER_PORT);
});

function updateValues(data) {
    var changed = 0;
    var keyArray = ["temp", "humidity", "light"];

    keyArray.forEach(function(key, index) {
	var tempSensor = sensors[key];
	var newData = parseInt(data[tempSensor.dataIndex]);

	if (newData === NaN) continue;

	if (tempSensor.current != newData) {
	    tempSensor.current = newData;
	    changed = 1;
	}

	if (tempSensor.high < newData) {
	    tempSensor.high = newData;
	}

	if (tempSensor.low > newData) {
	    tempSensor.low = newData;
	}

    });

    return changed;
}

