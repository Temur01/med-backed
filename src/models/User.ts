import pool from "../config/database";

export interface User {
  id: string;
  before_image: string | null;
  after_image: string | null;
  patient_info: string;
  chatgpt_text: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  beforeImage: string | null;
  afterImage: string | null;
  patientInfo: string;
  chatGptText: string;
}

export class UserModel {
  static async create(data: CreateUserData): Promise<User> {
    const query = `
      INSERT INTO users (before_image, after_image, patient_info, chatgpt_text)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      data.beforeImage,
      data.afterImage,
      data.patientInfo,
      data.chatGptText,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll(): Promise<User[]> {
    const query = "SELECT * FROM users ORDER BY created_at DESC";
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const query = "DELETE FROM users WHERE id = $1";
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  static async initTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        before_image TEXT,
        after_image TEXT,
        patient_info TEXT NOT NULL,
        chatgpt_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await pool.query(query);
  }
}
