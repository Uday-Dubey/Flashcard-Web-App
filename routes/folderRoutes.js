const express = require ('express');
const router = express.Router();
const folderController = require('../controllers/folderController');


// Create new folder
router.post('/', folderController.createFolder);

// Update folder
router.put('/:folderId', folderController.updateFolderName);

// Delete folder
router.delete('/:folderId', folderController.deleteFolder);

// Fetch user folders
router.get('/user/:userId', folderController.getUserFolders);

module.exports = router;