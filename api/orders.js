import { connectDB, Order } from './_lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();

  if (req.method === 'POST') {
    try {
      const { customerName, phone, address, city, items, total } = req.body;

      if (!customerName || !phone || !address || !city || !items?.length || !total) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const order = new Order(req.body);
      await order.save();
      return res.status(201).json(order);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
