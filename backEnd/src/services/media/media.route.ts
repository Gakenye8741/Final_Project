import { Router } from "express";
import {
  getAllMediaController,
  getMediaByEventIdController,
  getMediaByTypeController,
  createMediaController,
  updateMediaController,
  deleteMediaController,
} from "./media.controller"; // adjust path if needed

const router = Router();

// GET all media
router.get("/", getAllMediaController);

// GET media by event ID
router.get("/event/:eventId", getMediaByEventIdController);

// GET media by type (image or video)
router.get("/type/:type", getMediaByTypeController);

// POST new media
router.post("/", createMediaController);

// PUT update media by ID
router.put("/:mediaId", updateMediaController);

// DELETE media by ID
router.delete("/:mediaId", deleteMediaController);

export default router;
