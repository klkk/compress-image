import { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files, File } from "formidable";
import { PDFDocument } from "pdf-lib";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req: NextApiRequest): Promise<{file: Buffer, quality: number}> => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err: any, fields: Fields, files: Files) => {
      if (err) return reject(err);
      const f = files.file as File;
      let quality = parseInt(fields.quality as string) || 70;
      if (quality < 10) quality = 10;
      if (quality > 100) quality = 100;
      const buffer = fs.readFileSync(f.filepath);
      resolve({ file: buffer, quality });
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { file, quality } = await parseForm(req);
    const pdfDoc = await PDFDocument.load(file);
    const output = await pdfDoc.save({ useObjectStreams: true });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=compressed.pdf");
    res.send(output);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
