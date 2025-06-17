const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');
const { authenticateToken } = require('../utilities/authenticateToken');

router.get('/', authenticateToken, noteController.getAllNotes);
router.get('/search', authenticateToken, noteController.searchNotes);
router.get("/notes", authenticateToken, noteController.getAllNotes);
router.post('/', authenticateToken, noteController.addNote);
router.get('/:id', authenticateToken, noteController.getNoteById);
router.put('/:id', authenticateToken, noteController.editNote);
router.delete('/:id', authenticateToken, noteController.deleteNote);
router.patch('/:id/pin', authenticateToken, noteController.updatePinned);

module.exports = router;
