import { PrismaClient } from "@prisma/client";
import { urlGenerator } from "../utils/urlGenerator";

const prisma = new PrismaClient();

export async function getImages(skip: number, take: number, search?: string) {
  const images = await prisma.photos.findMany({
    take,
    skip,
    where: search ? { prompt: { contains: search } } : undefined,
    orderBy: { download: "desc" },
    select: {
      id: true,
      imageID: true,
      channelID: true,
      prompt: true,
      height: true,
      width: true,
      size: true,
      attachments: {
        select: {
          id: true,
          name: true,
          expires: true,
          issued: true,
          signature: true,
        },
      },
    },
  });

  const imagesWithUrl: {
    id: string;
    prompt: string;
    height: number;
    width: number;
    size: number;
    url: string;
  }[] = [];

  for (const image of images) {
    imagesWithUrl.push({
      id: image.id,
      prompt: image.prompt,
      height: image.height,
      width: image.width,
      size: image.size,
      url: await urlGenerator({
        imageID: image.imageID,
        channelID: image.channelID,
        attachmentID: image.attachments.id,
        fileName: image.attachments.name,
        expires: image.attachments.expires,
        issued: image.attachments.issued,
        signature: image.attachments.signature,
      }),
    });
  }

  return imagesWithUrl;

  // return images.map(
  //   async ({
  //     id,
  //     imageID,
  //     channelID,
  //     height,
  //     prompt,
  //     size,
  //     width,
  //     attachments,
  //   }) => ({
  //     id,
  //     prompt,
  //     height,
  //     width,
  //     size,
  //     url: await urlGenerator({
  //       imageID,
  //       channelID,
  //       attachmentID: attachments.id,
  //       fileName: attachments.name,
  //       expires: attachments.expires,
  //       issued: attachments.issued,
  //       signature: attachments.signature,
  //     }),
  //   })
  // );
}

export function getALLImagesIDAndPrompt() {
  return prisma.photos.findMany({
    select: { id: true, prompt: true },
    orderBy: { download: "desc" },
  });
}

export async function getImageByID(id: string) {
  const image = await prisma.photos.findUnique({
    where: { id },
    select: {
      id: true,
      imageID: true,
      prompt: true,
      channelID: true,
      height: true,
      width: true,
      size: true,
      download: true,
      attachments: {
        select: {
          id: true,
          name: true,
          expires: true,
          issued: true,
          signature: true,
        },
      },
    },
  });

  if (!image) return null;

  return {
    id: image.id,
    prompt: image.prompt,
    height: image.height,
    width: image.width,
    size: image.size,
    url: await urlGenerator({
      imageID: image.imageID,
      channelID: image.channelID,
      attachmentID: image.attachments.id,
      fileName: image.attachments.name,
      expires: image.attachments.expires,
      issued: image.attachments.issued,
      signature: image.attachments.signature,
    }),
  };
}

export async function countImages(search?: string) {
  return prisma.photos.count({
    where: search ? { prompt: { contains: search } } : undefined,
  });
}

export function updateImageForDownload(id: string) {
  return prisma.photos.update({
    where: { id },
    data: { download: { increment: 1 } },
  });
}

export function updateAttachmentByID({
  id,
  name,
  expires,
  issued,
  signature,
}: {
  id: string;
  name: string;
  expires: string;
  issued: string;
  signature: string;
}) {
  return prisma.attachments.update({
    where: { id },
    data: { name, expires, issued, signature },
  });
}
