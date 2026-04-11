import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectDB, Product } from './_lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();

    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    // Fetch last 12 products for context
    const products = await Product.find({}, 'name price sizes stock category material').limit(12).lean();

    const systemPrompt = `You are a helpful assistant for Gen Z Front, a men's streetwear clothing store based in Egypt.
Only answer questions about our products, sizes, shipping, orders, and store policies.
Keep answers short, friendly, and conversational. Answer in the same language the customer uses.
If asked something unrelated to the store, politely redirect back to shopping.

STORE POLICIES:
- Shipping: Cairo = 50 EGP (2-3 days), Alexandria = 60 EGP (3-4 days), Other cities = 70 EGP (4-5 days)
- Payment: Cash on delivery only
- Returns: Within 7 days, item must be unworn with tags
- Sizes: We follow standard EU sizing. When in doubt, size up.

CURRENT PRODUCTS IN STOCK:
${JSON.stringify(products, null, 2)}

If a customer asks about a specific product's stock or price, use the data above.
If stock is 0, tell them it's currently out of stock.`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build history for multi-turn: last 6 messages
    const recentHistory = history.slice(-6);
    const chatHistory = recentHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood! I\'m ready to help customers of Gen Z Front.' }] },
        ...chatHistory
      ],
      generationConfig: { maxOutputTokens: 300 }
    });

    // Race against 7-second timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 7000)
    );

    const result = await Promise.race([
      chat.sendMessage(message),
      timeoutPromise
    ]);

    const reply = result.response.text();
    return res.status(200).json({ reply });

  } catch (err) {
    if (err.message === 'timeout') {
      return res.status(200).json({ reply: "Sorry, I'm a bit slow right now. Please try again in a moment!" });
    }
    console.error('Chatbot error:', err);
    return res.status(500).json({ error: err.message, stack: err.stack, reply: `API ERROR: ${err.message}` });
  }
}
