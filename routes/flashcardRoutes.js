const express = require('express');
const router = express.Router();
const flashcardController = require('../controllers/flashcardController');

// Create
router.post('/', flashcardController.createFlashcard);

// Update
router.put('/:flashcardId', flashcardController.updateFlashcard);

// Delete
router.delete('/:flashcardId', flashcardController.deleteFlashcard);

// Fetch
router.get('/folder/:folderId',flashcardController.getFolderFlashcards);

module.exports = router;