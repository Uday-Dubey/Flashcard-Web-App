const mongoose = require('mongoose');
const Folder = require('../models/Folder');
const Flashcard = require('../models/Flashcard');

// Creating Folder
const createFolder = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // ✅ Log request body for debugging

        const { name, user } = req.body;
        if (!name || !user) {
            console.error("Missing name or userId:", { name, user }); // ❌ Log missing data
            return res.status(400).json({ error: "Folder name and user ID are required" });
        }

        const folder = await Folder.create({ name, user: user });

        console.log("Folder Created Successfully:", folder); // ✅ Log folder creation success
        res.status(201).json({ folder });
    } catch (error) {
        console.error("Failed to create folder:", error); // ❌ Log the actual error
        res.status(500).json({ error: "Failed to create folder" });
    }
};



// Update Folder
const updateFolderName = async(req,res)=>{
    const {folderId}= req.params;
    const {name} = req.body;
    try{
        const updatedFolder = await Folder.findByIdAndUpdate(
            folderId,
            {name},
            {new : true},
        ) ;
        if(!updatedFolder){
            return res.status(404).json({error: "Folder not found"});
        }
        res.status(200).json({message:"Folder updated successfully", folder : updatedFolder});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

// Delete Folder
const deleteFolder = async(req,res)=>{
    const { folderId } = req.params;
    try{
        const folder = await Folder.findById(folderId);
        if(!folder){
            return res.status(404).json({error:"Folder not found"});
        }

        // Flascard Delete
        await Flashcard.deleteMany({ _id: {$in: folder.flashcards }});
        
        // Delete Folders
        await folder.deleteOne();

        res.status(200).json({message:"Folder and flashcards deleted successfully"});
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

// Get all folders for user
const getUserFolders = async (req,res)=>{
    try{
        const userId = new mongoose.Types.ObjectId(req.params.userId)
        const folders = await Folder.find({ user: userId});
        res.status(200).json({folders});
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

module.exports = {createFolder, updateFolderName, deleteFolder, getUserFolders};