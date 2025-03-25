const Flashcard = require('../models/Flashcard');
const Folder = require('../models/Folder');

// Create
const createFlashcard = async( req, res) =>{
    try{
        const {question, answer, folderId} = req.body;
        if(!question || !answer || !folderId){
           return res.status(400).json({ error: "Question, Answer and FolderID are required."});
        }

        // Create Flashcard
        const flashcard = await Flashcard.create({ question, answer, folder: folderId});

        // Add flashcard id to folder
        await Folder.findByIdAndUpdate(folderId, {$push: {flashcards: flashcard._id}});

        res.status(201).json({ flashcard });
    }catch(error){
        res.status(500).json({error: error.message});

    }
};

// Update
const updateFlashcard = async(req,res)=>{
    const { flashcardId } = req.params;
    const { question, answer } =req.body;

    try{
        const updatedFlashcard  = await Flashcard.findByIdAndUpdate(
            flashcardId,
            { question , answer },
            { new:true },
        );
        if(!updatedFlashcard){
           return res.status(404).json({error: "Flashcard not found."});
        }
        res.status(200).json({message: "Flashcard updated successfully", flashcard: updatedFlashcard});
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

// Delete
const deleteFlashcard = async(req,res) =>{
    const { flashcardId } = req.params;
    try{
        const flashcard = await Flashcard.findById(flashcardId);
        if(!flashcard){
            return res.status(404).json({ error:"Flashcard not found" });
        }

        await Folder.findByIdAndUpdate(flashcard.folder, {$pull: {flashcards: flashcardId }});
        await flashcard.deleteOne();

        res.status(200).json({message: "Flashcard deleted successfully"});
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

// Get flashcards
const getFolderFlashcards = async(req,res)=>{
    const { folderId } = req.params;
    try{
        const flashcards = await Flashcard.find({folder : folderId});
        res.status(200).json({ flashcards });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createFlashcard, updateFlashcard, deleteFlashcard, getFolderFlashcards };