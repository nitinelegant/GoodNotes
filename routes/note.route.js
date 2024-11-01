import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  addNote,
  editNote,
  getAllNotes,
  deleteNote,
  updatePinnedNote,
} from "../controller/note.controller.js";

const router = express.Router();

router.post("/add", verifyToken, addNote);
router.post("/edit/:noteId", verifyToken, editNote);
router.get("/all", verifyToken, getAllNotes);
router.delete("/delete/:noteId", verifyToken, deleteNote);
router.put("/update-pinned-note/:noteId", verifyToken, updatePinnedNote);

export default router;
