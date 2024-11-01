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
export const editNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) {
      return next(errorHandler(404, "Note not found"));
    }
    if (note.userId !== req.user.id) {
      return next(errorHandler(403, "You can only edit your own notes"));
    }
    const { title, content, tags, isPinned } = req.body;
    if (!title && !tags && !content && !isPinned) {
      return next(errorHandler(400, "No fields to update"));
    }
    if (title) {
      note.title = title;
    }
    if (content) {
      note.content = content;
    }
    if (tags) {
      note.tags;
    }
    if (isPinned) {
      note.isPinned = isPinned;
    }
    await note.save();

    res.status(201).json({
      succuess: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllNotes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notes = await Note.find({ userId }).sort({ isPinned: -1 });

    res.status(201).json({
      succuess: true,
      message: "All notes fetched successfully",
      notes,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteNote = async (req, res, next) => {
  try {
    const noteId = req.params.noteId;
    const note = await Note.findOne({ _id: noteId, userId: req.user.id });
    if (!note) {
      return next(errorHandler(404, "Note not found"));
    }
    if (note.userId !== req.user.id) {
      return next(errorHandler(403, "You can only delete your own notes"));
    }
    await note.deleteOne({ _id: noteId });

    res.status(201).json({
      succuess: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const updatePinnedNote = async (req, res, next) => {
  try {
    const noteId = req.params.noteId;
    const note = await Note.findById({ _id: noteId });
    if (!note) {
      return next(errorHandler(404, "Note not found"));
    }
    if (note.userId !== req.user.id) {
      return next(errorHandler(403, "You can only delete your own notes"));
    }
    const { isPinned } = req.body;
    note.isPinned = isPinned;
    await note.save();

    res.status(201).json({
      succuess: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};
