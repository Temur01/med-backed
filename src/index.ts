import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import userRoutes from "./routes/userRoutes";
import { UserModel } from "./models/User";
import { testOpenAI } from "./utils/openai";
import { setupSwagger } from "./config/swagger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Yuklangan fayllarni xizmat qilish
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Swagger hujjatlarini sozlash
setupSwagger(app);

// Routelar
app.use("/api/users", userRoutes);

// Sog'liqni tekshirish endpoint'i
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server ishlamoqda" });
});

/**
 * @swagger
 * /api/test-openai:
 *   post:
 *     summary: Test OpenAI integration
 *     tags: [OpenAI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OpenAITestRequest'
 *     responses:
 *       200:
 *         description: OpenAI response generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OpenAITestResponse'
 *       400:
 *         description: Bad request - input is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post("/api/test-openai", async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ error: "Kirish ma'lumotlari talab qilinadi" });
    }

    const response = await testOpenAI(input);
    res.json({ response });
  } catch (error) {
    console.error("OpenAI test xatosi:", error);
    res.status(500).json({ error: "OpenAI so'rovini qayta ishlashda xatolik" });
  }
});

// Ma'lumotlar bazasini ishga tushirish va serverni boshlash
async function startServer() {
  try {
    // Ma'lumotlar bazasi jadvalini ishga tushirish
    await UserModel.initTable();
    console.log("Ma'lumotlar bazasi jadvali ishga tushirildi");

    app.listen(PORT, () => {
      console.log(`Server ${PORT} portida ishlamoqda`);
      console.log(`Sog'liqni tekshirish: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Serverni ishga tushirishda xatolik:", error);
    process.exit(1);
  }
}

startServer();
