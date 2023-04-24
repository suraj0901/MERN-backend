import { Router } from "express";
import notesController from "../controllers/notesController.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const router = Router();

router.use(verifyJWT)
router
  .route("/")
  .get(notesController.getAllNotes)
  .post(notesController.createNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote);

export default router;
