import { test, expect } from "@playwright/test";
import * as argon2 from "argon2";
import { User } from "../../backend/src/entities/user";
import { closeDB, initDB } from "./helpers";
import { clearDB } from "../../backend/src/config/db";

test.beforeAll(initDB);

test.beforeEach(async () => {
  await clearDB();
  createUser();
});

test.afterAll(closeDB);

const email = "monmailtest7@mail.com";
const password = "monmdptest7";

async function createUser() {
  const hashPassword = await argon2.hash(password);
  await User.create({ email, password: hashPassword }).save();
}

test("can connect with correct credentials", async ({ page }) => {
  await page.goto("http://localhost:3000/auth/login");
  await expect(page).toHaveTitle(/Se connecter/);
  await page.getByTestId("login-email").fill(email);
  await page.getByTestId("login-password").fill(password);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await page.pause();
});

test("cannot connect with incorrect password", async ({ page }) => {
  await page.goto("http://localhost:3000/auth/login");
  await expect(page).toHaveTitle(/Se connecter/);
  await page.getByTestId("login-email").fill(email);
  await page.getByTestId("login-password").fill("notcorrect");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page.getByText("Vérifiez vos informations.")).toBeVisible();
  await page.pause();
});
