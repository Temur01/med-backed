import { Request, Response } from "express";
import { UserModel, CreateUserData } from "../models/User";
import { generateMedicalAnalysis } from "../utils/openai";

export class UserController {
  static async createUser(req: Request, res: Response) {
    try {
      const { patientInfo } = req.body;
      const beforeImage = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )?.["beforeImage"]?.[0];
      const afterImage = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )?.["afterImage"]?.[0];

      // Rasm yuklashlarni ixtiyoriy qilish
      const beforeImagePath = beforeImage
        ? `/uploads/${beforeImage.filename}`
        : null;
      const afterImagePath = afterImage
        ? `/uploads/${afterImage.filename}`
        : null;

      if (!patientInfo) {
        return res
          .status(400)
          .json({ error: "Bemor ma'lumotlari talab qilinadi" });
      }

      // ChatGPT tahlilini yaratish
      const chatGptText = await generateMedicalAnalysis(
        beforeImagePath,
        afterImagePath,
        patientInfo,
      );

      // Foydalanuvchi ma'lumotlarini yaratish
      const userData: CreateUserData = {
        beforeImage: beforeImagePath,
        afterImage: afterImagePath,
        patientInfo,
        chatGptText,
      };

      const user = await UserModel.create(userData);

      res.status(201).json({
        user: {
          id: user.id,
          beforeImage: user.before_image,
          afterImage: user.after_image,
          patientInfo: user.patient_info,
          chatGptText: user.chatgpt_text,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
        chatGptText,
      });
    } catch (error) {
      console.error("Foydalanuvchi yaratishda xatolik:", error);
      res.status(500).json({ error: "Ichki server xatosi" });
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserModel.findAll();

      const formattedUsers = users.map((user) => ({
        id: user.id,
        beforeImage: user.before_image,
        afterImage: user.after_image,
        patientInfo: user.patient_info,
        chatGptText: user.chatgpt_text,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      }));

      res.json(formattedUsers);
    } catch (error) {
      console.error("Foydalanuvchilarni olishda xatolik:", error);
      res.status(500).json({ error: "Ichki server xatosi" });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
      }

      res.json({
        id: user.id,
        beforeImage: user.before_image,
        afterImage: user.after_image,
        patientInfo: user.patient_info,
        chatGptText: user.chatgpt_text,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      });
    } catch (error) {
      console.error("Foydalanuvchini olishda xatolik:", error);
      res.status(500).json({ error: "Ichki server xatosi" });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await UserModel.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Foydalanuvchini o'chirishda xatolik:", error);
      res.status(500).json({ error: "Ichki server xatosi" });
    }
  }
}
