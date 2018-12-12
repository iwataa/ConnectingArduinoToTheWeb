const SERIAL_PATH = 'COM3';
const SERVER_PORT = 3000;

const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const SerialPort = require('serialport');
const parser = new SerialPort.parsers.Readline();
const serialport = new SerialPort(SERIAL_PATH);

app.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('index');
});

serialport.pipe(parser);
serialport.on('open', function() {
	console.log('Serial port opened');
});

serialport.on('error', function(error) {
	console.log('serial port error');
	console.log(error);
	process.exit(1);
});

io.on('connection', function(socket) {
	console.log('socket.io connection');
	parser.on('data', function(data) {
		data = data.toString().trim();
		console.log(data); // for debug
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

	
