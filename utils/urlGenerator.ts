import { updateAttachmentByID } from "../services/imageService";

export async function urlGenerator({
  imageID,
  channelID,
  attachmentID,
  fileName,
  expires,
  issued,
  signature,
}: {
  imageID: string;
  channelID: string;
  attachmentID: string;
  fileName: string;
  expires: string;
  issued: string;
  signature: string;
}) {
  if (isExpired(expires)) {
    let min_id = BigInt(imageID);
    min_id -= BigInt(1);
    let max_id = BigInt(imageID);
    max_id += BigInt(1);

    const searchResult = await fetch(
      `https://discord.com/api/v9/guilds/662267976984297473/messages/search?channel_id=${channelID}&min_id=${min_id}&max_id=${max_id}`,
      {
        headers: {
          Authorization:
            "MTIwNTEzOTU1NTA3MDY0NDI2NQ.GZ2ixI.eEY__dnfMWxocNsXm6u3gjZN6LmTb9gx5XFVeA",
        },
      }
    ).then((res) => res.json());

    const url = searchResult.messages[0][0].attachments[0].url;

    const newAttachment = await updateAttachmentByID(urlParser(url));

    return `https://media.discordapp.net/attachments/${channelID}/${newAttachment.id}/${newAttachment.name}?ex=${newAttachment.expires}&is=${newAttachment.issued}&hm=${newAttachment.signature}`;
  }

  return `https://media.discordapp.net/attachments/${channelID}/${attachmentID}/${fileName}?ex=${expires}&is=${issued}&hm=${signature}`;
}

function isExpired(expires: string) {
  const date = parseInt(expires, 16);
  return new Date(date * 1000) < new Date();
}

function urlParser(imageURL: string) {
  const url = new URL(imageURL);
  // Extract the pathname parts
  const pathParts = url.pathname.split("/");

  // Extract the filename
  const fileName = pathParts.pop() || "";

  // Extract the ID
  const id = pathParts.pop() || "";

  // Extract query parameters
  const queryParams = Object.fromEntries(url.searchParams.entries());

  // Create the desired object
  return {
    id,
    name: fileName,
    expires: queryParams.ex,
    issued: queryParams.is,
    signature: queryParams.hm,
  };
}
