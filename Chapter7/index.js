const SERIALPORT_PATH = "COM3";
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

//serialport.on('data', data => console.log(data));

io.on('connection', (socket) => {
    // Show messaage on console
    console.log('socket.io connected');
    
    parser.on("data", (data) => {
        console.log(data);
        var dataKey = data.slice(0, 2);
        var dataString = data.slice(2);
        dataString = dataString.replace(/(\r\n|\n|\r)/gm, "");
        if (dataKey == "BP") {
            var dataArray = dataString.split(",");
            console.log(dataArray);
            socket.emit("button-data", dataArray);
        } else {
            var dataObject = {
                dataKey: dataKey,
                dataString: dataString
            };
            console.log(dataObject);
            socket.emit("bar-data", dataObject);
        }
    });

    socket.on('percentData', data => {
        console.log('percentData: ' + data);
        serialport.write(data + 'T');
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
setInterval(() => {}, 0)

