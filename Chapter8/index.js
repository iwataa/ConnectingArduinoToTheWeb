// vim: sts=4 sw=4 sm ai
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

io.on('connection', (socket) => {
    // Show messaage on console
    console.log('socket.io connected');

    var cnt = 0;
    
    parser.on("data", (data) => {
	data = data.replace(/(\r\n|\r|\n)/gm, "");
	var dataArray = data.split(",");
	console.log(cnt + ":" + dataArray);
	socket.emit("data", dataArray);
	cnt++;
    });
    
    // Message for disconnect event
    socket.on('disconnect', () => {
        console.log('disconnected');
    });
});


server.listen(SERVER_PORT, () => {
    console.log('listening on port ' + SERVER_PORT);
});


// Workaround for a bug that parser event is not fired
// https://github.com/node-serialport/node-serialport/issues/1751
//setInterval(() => {}, 0)

