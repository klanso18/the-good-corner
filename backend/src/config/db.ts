import { DataSource } from "typeorm";
import { Ad } from "../entities/ad";
import { Tag } from "../entities/tag";
import { Category } from "../entities/category";
import { User } from "../entities/user";

const db = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "0") || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "postgres",
  entities: [Ad, Tag, Category, User],
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "test",
});

export async function clearDB() {
  const entities = db.entityMetadatas;
  const tableNames = entities
    .map((entity) => `"${entity.tableName}"`)
    .join(", ");

  await db.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
}

export default db;
