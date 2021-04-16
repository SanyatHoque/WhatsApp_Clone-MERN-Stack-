const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Messagecontents = require('./message');
const socket = require('socket.io');
const path = require('path');
const cors = require('cors');

app.use(cors())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    next();
});
const PORT = process.env.PORT || 8085;
// Start the server at the specified PORT
const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors:{origin:'*'}})

app.set('view engine','ejs')
// Starting a socket on the specified server
// let io = socket(server);

const DB_USER = 'postgres';
const DB_PASSWORD = 'postgres';
// Assign the value of your mongoDB connection string to this constant
// const dbConnectString = "mongodb+srv://Sanyat:Sanyat1234@cluster0.r6sod.mongodb.net/Realchatdb?retryWrites=true&w=majority";
const db_mongo_atlas_compass = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.r6sod.mongodb.net/samplename?retryWrites=true&w=majority`;
// Updating mongoose's promise version
mongoose.Promise = global.Promise;
// Connecting to MongoDB through Mongoose
mongoose.connect(db_mongo_atlas_compass)
    .then(() => {
        console.log('connected to the db');
    }).catch((err) => {
        console.log(err);
    });

// Middleware to parse the request body as json
app.use(bodyParser.json());

// GET all the previous messages
app.get('/api/message', (req, res) => {
    Messagecontents.find()
    .exec((err, x1) => {
        if(err) {
            res.send(err).status(500);
        } else {
            res.send(x1).status(200);
        }
    });
});
// // GET all the previous messages
// app.get('/api/message/:postId', (req, res) => {
//     Messages.findById(req.params.postId).exec((err, messages) => {
//         if(err) {
//             res.send(err).status(500);
//         } else {
//             res.send(messages).status(200);
//         }
//     });
// });
// GET all the previous messages
// app.get('/api/message/:postId', (req, res) => {
//     Messages.find({street_no: req.params.postId}).exec((err, messages) => {      //"street_no":"12"      "Street": "Belcourt"  findById
//         if(err) {
//             res.send(err).status(500);
//         } else {   
//             res.send(messages).status(200);
//             console.log(messages);
//         }
//     });
// });
// POST a new message
app.post('/api/message', (req, res) => {
    Messagecontents.create(req.body)
    .then((x1) => {
        res.send(x1).status(200);})
    .catch((err) => {
        res.send(err).status(500);
    });
});
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
io.on("connection", (socket) => {
    socket.join(529);
    socket.on("new-message-front", (data) => {
        // socket.join(data.room);    socket.to(data.room)
        socket.to(529).emit("new-message-backend", data);
        console.log("data",data);
    });
});