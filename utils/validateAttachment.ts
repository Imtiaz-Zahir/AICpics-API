import { updateAttachmentByID } from "../services/imageService";

export default async function validateAttachment(
  massageID: string,
  channelID: string
) {
  let min_id = BigInt(massageID);
  min_id -= BigInt(1);

  const authKey = process.env.DISCORD_AUTH_KEY as string | undefined;
  if (!authKey) throw new Error("DISCORD_AUTH_KEY is required");

  const res = await fetch(
    `https://discord.com/api/v9/channels/${channelID}/messages?after=${min_id}&limit=1`,
    {
      headers: {
        Authorization: authKey,
      },
    }
  );
  const searchResult = await res.json();

  if (searchResult.message) {
    const limitFor = res.headers.get("Retry-After");
    if (limitFor) {
      console.log(`Rate limited for ${limitFor} seconds`);
      await delay((parseInt(limitFor)+1) * 1000);
    }
    return null;
  }

  const url = searchResult[0].attachments[0]?.url;
  if (!url) return null;

  const newAttachment = urlParser(url);

  if (!newAttachment) return null;

  await updateAttachmentByID(massageID, newAttachment);
  console.log("Attachment send for validation ->", massageID);

  return {
    expiresAt: newAttachment.expiresAt,
    issuedAt: newAttachment.issuedAt,
    signature: newAttachment.signature,
  };
}

function urlParser(imageURL: string) {
  const url = new URL(imageURL);

  const queryParams = Object.fromEntries(url.searchParams.entries());

  if (!queryParams.ex || !queryParams.is || !queryParams.hm) return null;

  return {
    expiresAt: queryParams.ex,
    issuedAt: queryParams.is,
    signature: queryParams.hm,
  };
}

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
