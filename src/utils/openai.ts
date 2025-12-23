import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// API kalit sozlanganligini tekshirish
if (!process.env.OPENAI_API_KEY) {
  console.warn("⚠️  OPENAI_API_KEY sozlanmagan. Tibbiy tahlil ishlamaydi.");
  console.warn("   Iltimos, server papkasida .env faylini yarating va OpenAI API kalitingizni kiriting.");
}

// OpenAI integratsiyasi uchun oddiy test funksiyasi
export const testOpenAI = async (input: string): Promise<string> => {
  try {
    // API kalit sozlanganligini tekshirish
    if (!process.env.OPENAI_API_KEY) {
      return "OpenAI API kaliti sozlanmagan. Iltimos, muhit o'zgaruvchilarida OPENAI_API_KEY ni o'rnating.";
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "Javob yaratilmadi";
  } catch (error) {
    console.error("OpenAI API xatosi:", error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return "Noto'g'ri yoki yo'q OpenAI API kaliti. Iltimos, sozlashlaringizni tekshiring.";
      }
    }
    
    return "Javob yaratishda xatolik. Iltimos, qayta urinib ko'ring.";
  }
};

export const generateMedicalAnalysis = async (
  beforeImagePath: string | null,
  afterImagePath: string | null,
  patientInfo: string,
): Promise<string> => {
  try {
    // API kalit sozlanganligini tekshirish
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API kaliti sozlanmagan");
      return "Tibbiy tahlil mavjud emas. Iltimos, server muhit o'zgaruvchilarida OpenAI API kalitini sozlang.";
    }

    // Hozircha biz bemor ma'lumotlariga asoslanib matn yaratamiz
    // Haqiqiy amalda rasmlarni tahlil qilish uchun OpenAI vision API dan foydalanasiz
    const imageInfo = [];
    if (beforeImagePath) imageInfo.push("Oldingi rasm mavjud");
    if (afterImagePath) imageInfo.push("Keyingi rasm mavjud");

    const prompt = `
      Quyidagi bemor ma'lumotlariga asoslanib, tibbiy tahlil bering:
      
      Bemor ma'lumotlari: ${patientInfo}
      ${imageInfo.length > 0 ? `Rasmlar: ${imageInfo.join(", ")}` : "Rasmlar taqdim etilmagan"}
      
      Iltimos, quyidagilarni o'z ichiga olgan to'liq tibbiy tahlil bering:
      1. Bemorning holatini baholash
      2. Mumkin bo'lgan davolash tavsiyalari
      3. Keyingi parvarishlash bo'yicha takliflar
      4. Kuzatish kerak bo'lgan tashvishlar yoki xavf belgilari
      
      ${imageInfo.length === 0 ? "Eslatma: Bu tahlil faqat bemor ma'lumotlariga asoslangan. Rasm tahlili qo'shimcha ma'lumot beradi." : "Eslatma: Rasm tahlili bu matnli tahlildan tashqari qo'shimcha ma'lumot beradi."}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Siz bemor ma'lumotlariga asoslanib tahlil beruvchi tibbiy AI yordamchisisiz. Haqiqiy tibbiy qarorlar uchun har doim sog'liqni saqlash mutaxassislari bilan maslahatlashishni tavsiya qiling.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return (
      completion.choices[0]?.message?.content || "Tahlil yaratib bo'lmadi"
    );
  } catch (error) {
    console.error("OpenAI API xatosi:", error);
    
    // Xato turiga qarab aniqroq xato xabarlarini taqdim etish
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return "Noto'g'ri yoki yo'q OpenAI API kaliti. Iltimos, sozlashlaringizni tekshiring.";
      } else if (error.message.includes('quota') || error.message.includes('billing')) {
        return "OpenAI API kvotasi tugagan. Iltimos, to'lov holatingizni tekshiring.";
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        return "OpenAI ga ulanishda tarmoq xatosi. Iltimos, keyinroq qayta urinib ko'ring.";
      }
    }
    
    return "Tibbiy tahlil yaratishda xatolik. Iltimos, qayta urinib ko'ring.";
  }
};
