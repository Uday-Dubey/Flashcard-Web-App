const mongoose= require('mongoose');
const bcrypt = require('bcrypt');


const folderSchema = new mongoose.Schema({
    name:{ type:String, required:true},
    user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    flashcards:[{type: mongoose.Schema.Types.ObjectId, ref:'Flashcard'}],
    createdAt:{type: Date, default: Date.now},
});

// Middleware: Delete all cards with folder
folderSchema.pre("deleteOne", { document:true, query:false }, async function (next){
    const Flashcard = require('./Flashcard');
    await Flashcard.deleteMany({ _id: { $in: this.flashcards }});
    next();
});

module.exports = mongoose.model('Folder', folderSchema);