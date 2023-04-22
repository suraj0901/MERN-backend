import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js";
import Note from "../models/Note.js";

/**
 * @desc Get All Notes
 * @type GET /notes
 * @access private
 */
const getAllNotes = expressAsyncHandler(async (req, res) => {
  const notes = await Note.find().lean();
  
  // If no notes
  if (!notes?.length) {
    return res.status(400).json({ message: "Notes not Found" });
  }

  // Add username to each note
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );

  res.json(notesWithUser);
});

/**
 * @desc Create a Note
 * @type POST /notes
 * @access private
 */
const createNote = expressAsyncHandler(async (req, res) => {
  const { title, text, user } = req.body;

  // Confirm input
  if (!title || !text || !user) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate
  const duplicate = await Note.findOne({ title }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Note" });
  }

  // Create and Store note
  const note = await Note.create({ title, text, user });
  
  if (!note) {
    return res.status(400).json({ message: "Invalid note data recieved" });
  }

  res.status(201).json({ message: "New note created" });
});

/**
 * @desc Update a Note
 * @type PATCH /notes
 * @access private
 */
const updateNote = expressAsyncHandler(async (req, res) => {
  const { id, title, text, user, completed } = req.body;

  // Confirm data
  if (!id || !title || !text || !user || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm note exits to update
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not Found" });
  }

  // Check for duplicate
  const duplicate = await Note.findOne({ title }).lean().exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Note title" });
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;
  
  const updatedNote = await note.save();

  if (!updatedNote) {
    return res.status(400).json({ message: "Invalid note data recieved" });
  }

  res.status(201).json({ message: `${updatedNote.title} updated` });
});

/**
 * @desc Delete a Note
 * @type DELETE /notes
 * @access private
 */
const deleteNote = expressAsyncHandler(async (req, res) => {
    const {id} = req.body

    // Confirm data
    if(!id) {
        return res.status(400).json({message: "Note ID required"})
    }

    // Confirm note exits to delete
    const note = await Note.findById(id).exec()

    if(!note) {
        return res.status(400).json({message: "Note not found"})
    }

    const result =  await note.deleteOne()

    res.json({message: `Note ${result.title} with ID ${result._id} deleted`})
});

export default {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
};
