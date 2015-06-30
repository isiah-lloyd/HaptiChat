var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var backup_button_stats = "button_presses.txt";
var users_online = 0;
var stat_button_pressed = 0;

fs.exists(backup_button_stats, function (exists) {
    "use strict";
    if (exists) {
        console.log("Found backup file of button clicks...");
        fs.readFile(backup_button_stats, "utf8", function (error, data) {
            if (error) {
                throw error;
            }
            console.log("Restoring " + data + " button clicks");
            stat_button_pressed = data;
        });
    }
    else {
        console.log("Backup of Button click not found...creating backup file");
        fs.open(backup_button_stats, 'w');
    }

});


app.get('/', function (req, res) {
    "use strict";
    res.sendFile(__dirname +'/index.html');
});
io.on('connection', function (socket) {
    "use strict";
    users_online++;
    console.log('a user connected; user count:', users_online);
    io.emit('users_online', users_online);
    io.emit('stat_button_pressed', stat_button_pressed);
    socket.on('button_press', function () {
        stat_button_pressed++;
        socket.broadcast.emit('vibrate');
        io.emit('stat_button_pressed', stat_button_pressed);
        console.log('button was pressed; button count:', stat_button_pressed);
    });
    socket.on('disconnect', function () {
        users_online--;
        io.emit('users_online',users_online);
        console.log('a user disconnected; user count:', users_online);
  });
});

http.listen(8000, function () {
    "use strict"
    console.log('listening on *:8000');
});

function exitHandler() {
    setTimeout(function () {
        "use strict"
        console.log("Clean up initiated...");
        fs.writeFile(backup_button_stats, stat_button_pressed, 'utf8', function (error) {
            if (error) {
                throw error;
            }
            else{
            console.log("Wrote " + stat_button_pressed + " to " + backup_button_stats);
            process.exit();
            }
        });
    }, 1000);
}
setInterval(function () {
    console.log("Time activated save...");
    fs.writeFile(backup_button_stats, stat_button_pressed, 'utf8', function(error){
        if (error){ throw error;}
        else{
        console.log("Wrote " + stat_button_pressed + " to " + backup_button_stats);
        }
    });
}, 300000);
//do something when app is closing
process.on('exit', exitHandler);

//catches ctrl+c event
process.on('SIGINT', exitHandler);

//catches uncaught exceptions
process.on('uncaughtException', exitHandler);