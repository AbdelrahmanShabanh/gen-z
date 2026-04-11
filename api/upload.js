import { verifyAdmin } from './_lib/auth.js';
import cloudinary from './_lib/cloudinary.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!verifyAdmin(req, res)) return;

  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided' });

    const result = await cloudinary.uploader.upload(image, {
      folder: 'genzfront-products',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }]
    });

    return res.status(200).json({ url: result.secure_url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
