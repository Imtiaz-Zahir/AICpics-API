import { Request, Response, NextFunction } from "express";
import { error } from "../utils/error";
import { decryptKey } from "../utils/hash";
import validateAttachment from "../utils/validateAttachment";
import { getMedia } from "../services/mediaService"

export async function getImage(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const key = request.query.key as string | undefined;
    let width = Number(request.query.width);
    let height = Number(request.query.height);

    if (!key) {
      throw error("Key is required", 400);
    }
    const decryptedData = decryptKey(key.replace(/\s/g, "+"));

    if (!decryptedData) {
      throw error("Invalid key", 400);
    }
    let { aid, cid, ex, fn, is, sg, mid } = decryptedData;

    if (new Date(parseInt(ex, 16) * 1000) < new Date()) {
      const newAttachment = await validateAttachment(mid, cid);
      if (newAttachment) {
        ex = newAttachment.expiresAt;
        is = newAttachment.issuedAt;
        sg = newAttachment.signature;
      }
    }
    const imageUrl = `https://media.discordapp.net/attachments/${cid}/${aid}/${fn}?ex=${ex}&is=${is}&hm=${sg}&format=webp&quality=lossless&width=${width}&height=${height}`;

    const arrayBuffer = await getMedia(imageUrl);
    if(!arrayBuffer) throw new Error("Failed to fetch image");
    const buffer = Buffer.from(arrayBuffer);
    
    response.contentType("image/webp");
    response.setHeader("Cache-Control", "public, max-age=31536000");
    response.send(buffer);
  } catch (error) {
    next(error);
  }
}
