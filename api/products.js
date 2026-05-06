import { connectDB, Product } from './_lib/db.js';
import { verifyAdmin } from './_lib/auth.js';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
  } catch (dbErr) {
    return res.status(500).json({ error: 'Database connection failed: ' + dbErr.message });
  }

  if (req.method === 'GET') {
    try {
      const { category, featured, search } = req.query;
      const filter = {};

      if (category) filter.category = category;
      if (featured === 'true') filter.featured = true;
      if (search) filter.name = { $regex: search, $options: 'i' };

      const products = await Product.find(filter).sort({ createdAt: -1 });
      return res.status(200).json(products);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    if (!verifyAdmin(req, res)) return;
    try {
      const product = new Product(req.body);
      await product.save();
      return res.status(201).json(product);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

