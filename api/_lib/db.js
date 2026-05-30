import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load standard .env file
dotenv.config({ path: '.env.local' }); // Load .env.local file

let isConnected = false;

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, enum: ['hoodies', 'tshirts', 'pants', 'accessories'], required: true },
  sizes: [{ type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
  stock: { type: Number, default: 0 },
  images: [String],
  material: { type: String },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    size: String,
    qty: Number,
    price: Number,
    image: String
  }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered'], default: 'pending' },
  paymentMethod: { type: String, default: 'cash_on_delivery' },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

export async function connectDB() {
  if (isConnected) return;
  
  if (!process.env.MONGODB_URI) {
    throw new Error('Database connection failed: process.env.MONGODB_URI is undefined. Please ensure your .env or .env.local file is configured correctly.');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
