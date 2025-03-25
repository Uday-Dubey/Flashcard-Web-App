const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    question: { type:String, required:true },
    answer: { type:String, required:true },
    folder: { type: mongoose.Schema.Types.ObjectId, ref:'Folder', required:true },
    createdAt: { type:Date, default: Date.now},
});

module.exports = mongoose.model('Flashcard', flashcardSchema)