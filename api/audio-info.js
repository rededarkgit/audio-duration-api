import { getAudioDurationInSeconds } from 'get-audio-duration';
import fetch from 'node-fetch';
import fs from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const tempFilePath = join(tmpdir(), 'temp-audio.mp3');
    fs.writeFileSync(tempFilePath, buffer);

    const duration = await getAudioDurationInSeconds(tempFilePath);
    fs.unlinkSync(tempFilePath);

    return res.status(200).json({ duration });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
