import db from "../../backend/src/config/db";

export async function initDB() {
  await db.initialize();
}

export async function closeDB() {
  await db.destroy();
}
