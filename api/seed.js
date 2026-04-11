import { connectDB, Product } from './_lib/db.js';

const sampleProducts = [
  {
    name: 'Navy Essential Hoodie',
    description: 'Classic pullover hoodie in premium heavyweight cotton. Perfect for streetwear layering.',
    price: 349,
    category: 'hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 20,
    images: ['https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&auto=format'],
    material: '80% cotton, 20% polyester',
    featured: true
  },
  {
    name: 'Black Oversized Hoodie',
    description: 'Bold black hoodie with oversized silhouette. A Gen Z wardrobe staple.',
    price: 399,
    category: 'hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 20,
    images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&auto=format'],
    material: '100% cotton fleece',
    featured: false
  },
  {
    name: 'Grey Zip Hoodie',
    description: 'Versatile grey zip-up hoodie. Urban streetwear meets everyday comfort.',
    price: 299,
    category: 'hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 20,
    images: ['https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&auto=format'],
    material: '80% cotton, 20% polyester',
    featured: false
  },
  {
    name: 'White Oversized Tee',
    description: 'Premium heavyweight white tee with dropped shoulders. The foundation of every outfit.',
    price: 149,
    category: 'tshirts',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 20,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format'],
    material: '100% cotton',
    featured: true
  },
  {
    name: 'Black Graphic Tee',
    description: 'Street art graphic print on a soft washed black tee. Bold and expressive.',
    price: 199,
    category: 'tshirts',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 20,
    images: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&auto=format'],
    material: '100% cotton',
    featured: true
  },
  {
    name: 'Beige Vintage Tee',
    description: 'Washed beige tee with a vintage feel. Minimalist and effortlessly cool.',
    price: 179,
    category: 'tshirts',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 20,
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format'],
    material: '100% cotton',
    featured: false
  },
  {
    name: 'Olive Cargo Pants',
    description: 'Multi-pocket cargo pants in olive green. Functional street style at its finest.',
    price: 499,
    category: 'pants',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 20,
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format'],
    material: '100% cotton twill',
    featured: true
  },
  {
    name: 'Black Cargo Pants',
    description: 'Classic black cargo pants with utility pockets. The ultimate streetwear essential.',
    price: 449,
    category: 'pants',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 20,
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4168?w=600&auto=format'],
    material: '98% cotton, 2% elastane',
    featured: false
  },
  {
    name: 'Streetwear Cap',
    description: 'Six-panel structured cap with embroidered logo. Complete your look.',
    price: 149,
    category: 'accessories',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 20,
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format'],
    material: '100% cotton twill',
    featured: false
  },
  {
    name: 'Canvas Tote Bag',
    description: 'Heavy-duty canvas tote bag with graffiti print. Carry everything in style.',
    price: 99,
    category: 'accessories',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 20,
    images: ['https://images.unsplash.com/photo-1597274462943-5f2c019a3e2b?w=600&auto=format'],
    material: '100% canvas',
    featured: false
  }
];

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST to seed' });

  try {
    await connectDB();
    await Product.deleteMany({});
    const products = await Product.insertMany(sampleProducts);
    return res.status(201).json({ message: `Seeded ${products.length} products successfully`, count: products.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
