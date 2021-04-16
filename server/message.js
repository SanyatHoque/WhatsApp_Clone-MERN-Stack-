const mongoose = require('mongoose');

// Blueprint of what a message would look like in our DB.
const MessageSchema = new mongoose.Schema({
    room: {type: String},
    sender: {type: String},
    message: {type: String},
    // name: {type: String},
    timestamp: {type: Date,
                default: Date.now()},
    // socketid: {type: Number},
    received: {type: Boolean}

});
// Makes a model of the above schema.
const Messagecontent = mongoose.model("Messagecontent", MessageSchema);
// Exporting the model so that it can be used in server.js and/or other files.
module.exports = Messagecontent;