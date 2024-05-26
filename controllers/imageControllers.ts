import { Request, Response, NextFunction } from "express";
import { getImages, getImageByID, countImages,updateImageForDownload } from "../services/imageService";
import { error } from "../utils/error";

export async function imagesController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const searchQuery = request.query;

    const skip = Number(searchQuery.skip ?? 0);
    const take = Number(searchQuery.take ?? 30);

    if (take < 0 || skip < 0) throw error("Bad request", 400);

    if (take > 100) throw error("Max allowed 100 image", 400);

    const search = searchQuery.search as string | undefined;
    const searchText = search?.replace("+", " ");

    const images = await getImages(skip, take, searchText);
    const total = await countImages(searchText);

    response.json({ images,total });
  } catch (error) {
    next(error);
  }
}

export async function singleImageController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const imageId = request.params.id;

    const image = await getImageByID(imageId);
    if (!image) throw error("Image not found", 404);

    response.json(image);
  } catch (error) {
    next(error);
  }
}

export async function incrementDownloadController(
  request: Request,
  response: Response,
  next: NextFunction){
  try {
    const image = await updateImageForDownload(request.params.id);

    if (!image) throw error("Image not found", 404);

    response.json(image);
  } catch (error) {
    next(error);
  }
}