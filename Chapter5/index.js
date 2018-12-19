const SERVER_PORT = 3000;

var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

app.engine('ejs', require('ejs').__express);
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.render('index');
});

io.on('connection', (socket) => {
	console.log('socket.io connected');
	socket.on('disconnect', () => {
		console.log('disconnected');
	});
});

server.listen(SERVER_PORT, () => {
	console.log('listening on port ' + SERVER_PORT);
});

