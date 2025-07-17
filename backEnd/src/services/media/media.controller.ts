

import { Request, Response } from "express";
import {
  getAllMediaService,
  getMediaByEventIdService,
  searchMediaByTypeService,
  createMediaService,
  updateMediaService,
  deleteMediaService,
} from "../media/media.service";

// ✅ GET /media
export const getAllMediaController = async (req: Request, res: Response) => {
  try {
    const allMedia = await getAllMediaService();
    res.status(200).json(allMedia);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch media", error });
  }
};

// ✅ GET /media/event/:eventId
export const getMediaByEventIdController = async (req: Request, res: Response) => {
  const eventId = Number(req.params.eventId);
  if (isNaN(eventId)) return res.status(400).json({ message: "Invalid eventId" });

  try {
    const media = await getMediaByEventIdService(eventId);
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch media by event", error });
  }
};

// ✅ GET /media/type/:type
export const getMediaByTypeController = async (req: Request, res: Response) => {
  const type = req.params.type as "image" | "video";
  if (!["image", "video"].includes(type)) {
    return res.status(400).json({ message: "Type must be 'image' or 'video'" });
  }

  try {
    const results = await searchMediaByTypeService(type);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch media by type", error });
  }
};

// ✅ POST /media
export const createMediaController = async (req: Request, res: Response) => {
  const { eventId, type, url } = req.body;

  if (!eventId || !type || !url) {
    res.status(400).json({ message: "Missing required fields" }); 
    return;
  }

  try {
    await createMediaService({ eventId, type, url });
    res.status(201).json({ message: "Media created successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create media", error });
  }
};

// ✅ PUT /media/:mediaId
export const updateMediaController = async (req: Request, res: Response) => {
  const mediaId = Number(req.params.mediaId);
  if (isNaN(mediaId)) return res.status(400).json({ message: "Invalid mediaId" });

  try {
    await updateMediaService(mediaId, req.body);
    res.status(200).json({ message: "Media updated successfully 🔄" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update media", error });
  }
};

// ✅ DELETE /media/:mediaId
export const deleteMediaController = async (req: Request, res: Response) => {
  const mediaId = Number(req.params.mediaId);
  if (isNaN(mediaId)) return res.status(400).json({ message: "Invalid mediaId" });

  try {
    await deleteMediaService(mediaId);
    res.status(200).json({ message: "Media deleted successfully ❌" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete media", error });
  }
};
