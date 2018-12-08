var SERIAL_PORT = 'COM3';
var SERVER_PORT = 3000;

var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var SerialPort = require('serialport');
var serialport = new SerialPort(SERIAL_PORT, {
	parser: new SerialPort.parsers.Readline()
});

app.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('index');
});

serialport.on('open', function() {
	console.log('Serial port opened');
});

io.on('connection', function(socket) {
	console.log('socket.io connection');
	serialport.on('data', function(data) {
		data = data.toString().trim();
		//console.log(data); // for debug
		// Don't send data when trimmed data is empty.
		// With my environment, empty string is often received.
		if (data.length == 0) return;
		// Send button state to client
		socket.emit('data', data);
	});
	socket.on('disconnect', function() {
		console.log('Disconnected');
	});
});

server.listen(SERVER_PORT, function() {
	console.log('Listening on port ' + SERVER_PORT);
});

	
