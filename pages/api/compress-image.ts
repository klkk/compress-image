import { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req: NextApiRequest): Promise<{file: Buffer, mimetype: string, quality: number}> => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      const f = files.file as formidable.File;
      const mimetype = f.mimetype || "image/jpeg";
      let quality = parseInt(fields.quality as string) || 70;
      if (quality < 10) quality = 10;
      if (quality > 100) quality = 100;
      const buffer = fs.readFileSync(f.filepath);
      resolve({ file: buffer, mimetype, quality });
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { file, mimetype, quality } = await parseForm(req);

    let format: "jpeg" | "png" | "webp" | "gif" | "tiff" | "avif" = "jpeg";
    if (mimetype.includes("png")) format = "png";
    else if (mimetype.includes("webp")) format = "webp";
    else if (mimetype.includes("gif")) format = "gif";
    else if (mimetype.includes("tiff")) format = "tiff";
    else if (mimetype.includes("avif")) format = "avif";

    const image = sharp(file);
    let out: Buffer;
    if (format === "jpeg") out = await image.jpeg({ quality }).toBuffer();
    else if (format === "png") out = await image.png({ quality }).toBuffer();
    else if (format === "webp") out = await image.webp({ quality }).toBuffer();
    else if (format === "gif") out = await image.gif().toBuffer();
    else if (format === "tiff") out = await image.tiff({ quality }).toBuffer();
    else if (format === "avif") out = await image.avif({ quality: Math.round(quality / 2) }).toBuffer();
    else out = await image.jpeg({ quality }).toBuffer();

    res.setHeader("Content-Type", mimetype);
    res.setHeader("Content-Disposition", "attachment; filename=compressed." + format);
    res.send(out);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
