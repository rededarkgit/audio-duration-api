import { parseBuffer } from 'music-metadata';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const metadata = await parseBuffer(buffer, 'audio/mpeg');
    const duration = metadata.format.duration;

    res.status(200).json({ duration });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get duration', details: error.message });
  }
}
