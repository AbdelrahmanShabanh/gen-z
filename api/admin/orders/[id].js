import { connectDB, Order } from '../../_lib/db.js';
import { verifyAdmin } from '../../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed' });

  if (!verifyAdmin(req, res)) return;

  try {
    await connectDB();
    const { id } = req.query;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
