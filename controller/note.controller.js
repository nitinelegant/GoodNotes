import Note from "../models/note.model.js";
import { errorHandler } from "../utils/error.js";

export const addNote = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    const { id } = req.user;
    if (!title) {
      return next(errorHandler(400, "Title is required"));
    }
    if (!content) {
      return next(errorHandler(400, "Content is required"));
    }

    const newNote = new Note({
      title,
      content,
      tags: tags || [],
      userId: id,
    });
    newNote.save();
    res.status(201).json({
      succuess: true,
      message: "Note added successfully",
      newNote,
    });
  } catch (error) {
    next(error);
  }
};
