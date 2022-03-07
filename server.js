
const process = require("process");
const express = require('express'); // using express
const socketIO = require('socket.io');
const http = require('http');
const { Console } = require("console");
const port = process.env.PORT||4000 // setting the port
let app = express();
let server = http.createServer(app)
let io = socketIO(server)
const path = require("path")
 
server.listen(port,()=> console.log("connected"));

require('dotenv').config()
app.use(express.static('public'))


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });

io.on("connection", socket =>{
        socket.on("getAPI", () =>{
            socket.emit("getAPI",process.env.API,process.env.URL)
        })
    })
