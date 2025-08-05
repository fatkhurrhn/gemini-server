import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai"; // Pakai package yang benar

const app = express();
const PORT = 5000;

const GEMINI_API_KEY = 'AIzaSyAwbN7w9DrhtUPVKQnwTXUp6d8S5G5Di9o'; // 🔥 Ganti dengan key Anda

// Middleware
app.use(cors());
app.use(express.json());

// Inisialisasi Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY); // Perhatikan cara inisialisasi yang benar

// Route GET /
app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 Gemini Proxy Server</h1>
    <p>API berjalan dengan Gemini 1.5 Flash</p>
    <p>Gunakan <code>POST /chat</code> untuk chat</p>
  `);
});

// Route POST /chat
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
  }

  try {
    // Dapatkan model Gemini Pro
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Generate konten
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ 
      error: 'Error dari Gemini API',
      details: err.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});