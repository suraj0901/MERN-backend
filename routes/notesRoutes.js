import { Router } from "express";
import notesController from "../controllers/notesController.js";

const router = Router();

router
  .route("/")
  .get(notesController.getAllNotes)
  .post(notesController.createNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote);

export default router;
