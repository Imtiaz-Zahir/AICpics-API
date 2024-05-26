import { encryptData } from "./hash";

export default async function keyGenerator({
  massageID,
  channelID,
  attachmentID,
  fileName,
  expiresAt,
  issuedAt,
  signature,
}: {
  massageID: string;
  channelID: string;
  attachmentID: string;
  fileName: string;
  expiresAt: string;
  issuedAt: string;
  signature: string;
}) {
  if(!massageID||!channelID||!attachmentID||!fileName||!expiresAt||!issuedAt||!signature) throw new Error("Felids are missing in keyGenerator function");

  const key = encryptData(
    JSON.stringify({
      cid: channelID,
      mid:massageID,
      aid: attachmentID,
      fn: fileName,
      ex: expiresAt,
      is: issuedAt,
      hm: signature,
    })
  );

  return key;
}
