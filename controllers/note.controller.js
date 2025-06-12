const Note = require("../models/note.model");

// Get all notes
exports.getAllNotes = async (req, res) => {
  const { user } = req.user;
  const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
  res.json({ notes });
};

// Create note
exports.addNote = async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title || !content)
    return res
      .status(400)
      .json({ error: true, message: "Title and content required" });

  const note = new Note({ title, content, tags: tags || [], userId: user._id });
  await note.save();
  res.status(201).json({ note });
};

// Get note by ID
exports.getNoteById = async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.id,
    userId: req.user.user._id
  });
  if (!note)
    return res.status(404).json({ error: true, message: "Note not found" });
  res.json({ note });
};

// Update note
exports.editNote = async (req, res) => {
  const { title, content, tags, isPinned } = req.body;
  const note = await Note.findOne({
    _id: req.params.id,
    userId: req.user.user._id
  });
  if (!note)
    return res.status(404).json({ error: true, message: "Note not found" });

  Object.assign(note, { title, content, tags, isPinned });
  await note.save();
  res.json({ note });
};

// Delete note
exports.deleteNote = async (req, res) => {
  const deleted = await Note.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.user._id
  });
  if (!deleted)
    return res.status(404).json({ error: true, message: "Note not found" });
  res.json({ message: "Note deleted" });
};

// Search
exports.searchNotes = async (req, res) => {
  const { query } = req.query;
  if (!query)
    return res.status(400).json({ error: true, message: "Query is required" });

  const matchNotes = await Note.find({
    userId: req.user.user._id,
    $or: [
      { title: { $regex: new RegExp(query, "i") } },
      { content: { $regex: new RegExp(query, "i") } }
    ]
  });

  res.json({ notes: matchNotes });
};

// Update isPinned status
exports.updatePinned = async (req, res) => {
  const { isPinned } = req.body;

  const note = await Note.findOne({
    _id: req.params.id,
    userId: req.user.user._id
  });

  if (!note)
    return res.status(404).json({ error: true, message: "Note not found" });

  note.isPinned = !!isPinned;
  await note.save();

  res.json({ note });
};
