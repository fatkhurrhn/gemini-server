// server.js
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv'; // 🔴 Tambahkan ini

dotenv.config(); // 🔴 Load environment variables dari .env

const app = express();
const PORT = process.env.PORT || 9999;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 🔴 Tambahkan pengecekan API key
if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY tidak ditemukan di .env!');
  process.exit(1); // Hentikan server jika key tidak ada
}

// Middleware
app.use(cors());
app.use(express.json());

// Inisialisasi Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Route: GET /
app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 Gemini Proxy Server</h1>
    <p>Sip! API kamu berhasil 🎉</p>
    <p>Gunakan <code>POST /chat </code> untuk kirim pesan ke Gemini.</p>
  `);
});

// Route: POST /chat
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
  }

  try {
    // Gunakan model yang tersedia
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); 

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({
      error: 'Gagal dapat respons dari AI',
      details: err.message,
    });
  }
});

// Railway atur port otomatis
app.listen(PORT, () => {
  console.log(`🚀 Server jalan di http://localhost:${PORT}`);
});