// vim: sts=4 sw=4 si
const SERIALPORT_PATH = "/dev/ttyACM0";
const SERVER_PORT = 3000;

var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var SerialPort = require('serialport');
var parser = new SerialPort.parsers.Readline();
var serialport = new SerialPort(SERIALPORT_PATH);

serialport.pipe(parser);

app.engine('ejs', require('ejs').__express);
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));

var sensors = {
    temp: { current: 0, high: 100, low: 0, dataIndex:0 },
    humidity: { current: 0, high: 100, low: 0, dataIndex:1 },
    light: { current: 0, high: 10, low: 0, dataIndex:2 }
};

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

    if (hasChanged > 0) {
	io.emit("data", sensors);
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
	var newData = data[tempSensor.dataIndex];

	if (tempSensor.current !== newData) {
	    tempSensor.current = newData;
	    changed = 1;
	}

	if (tempSensor.current > tempSensor.high) tempSensor.current = tempSensor.high
	if (tempSensor.current < tempSensor.low) tempSensor.current = tempSensor.low
    });

    return changed;
}

