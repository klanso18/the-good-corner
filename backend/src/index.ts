import "reflect-metadata";
import express, { Request, Response } from "express";
import { validate } from "class-validator";
import { Ad } from "./entities/ad";
import { Tag } from "./entities/tag";
import { Category } from "./entities/category";
import db from "./config/db";
import { Like, In } from "typeorm";
import cors from "cors";

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

app.get("/tags", async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    const tags = await Tag.find({
      where: { name: name ? Like(`%${name}%`) : undefined },
    });
    res.send(tags);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/categories", async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({
      relations: {
        ads: true,
      },
    });
    res.send(categories);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/ads", async (req: Request, res: Response) => {
  const { tagIds } = req.query;
  const title = req.query.title as string | undefined;
  try {
    const ads = await Ad.find({
      relations: {
        category: true,
        tags: true,
      },
      where: {
        tags: {
          id:
            typeof tagIds === "string" && tagIds.length > 0
              ? In(tagIds.split(",").map((t) => parseInt(t, 10)))
              : undefined,
        },
        title: title ? Like(`%${title}%`) : undefined,
      },
    });
    res.send(ads);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/ads/:id", async (req: Request, res: Response) => {
  try {
    const ad = await Ad.findOneBy({ id: parseInt(req.params.id, 10) });
    if (!ad) return res.sendStatus(404);
    res.send(ad);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/ad", async (req: Request, res: Response) => {
  try {
    const newAd = Ad.create(req.body);
    const errors = await validate(newAd);
    if (errors.length !== 0) return res.status(422).send({ errors });
    res.send(await newAd.save());
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/tag", async (req: Request, res: Response) => {
  try {
    const newTag = Tag.create(req.body);
    const errors = await validate(newTag);
    if (errors.length !== 0) return res.status(422).send({ errors });
    res.send(await newTag.save());
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.delete("/ad/:id", async (req: Request, res: Response) => {
  try {
    const adToDelete = await Ad.findOneBy({ id: parseInt(req.params.id, 10) });
    if (!adToDelete) return res.sendStatus(404);
    await adToDelete.remove();
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.delete("/tag/:id", async (req: Request, res: Response) => {
  try {
    const tagToDelete = await Tag.findOneBy({
      id: parseInt(req.params.id, 10),
    });
    if (!tagToDelete) return res.sendStatus(404);
    await tagToDelete.remove();
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.patch("/ad/:id", async (req: Request, res: Response) => {
  try {
    const adToUpdate = await Ad.findOneBy({ id: parseInt(req.params.id, 10) });
    if (!adToUpdate) return res.sendStatus(404);
    //await Ad.update(parseInt(req.params.id, 10), req.body);
    await Ad.merge(adToUpdate, req.body);
    const errors = await validate(adToUpdate);
    if (errors.length !== 0) return res.status(422).send({ errors });
    res.send(await adToUpdate.save());
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(port, async () => {
  await db.initialize();
  console.log(`Server lauch on port ${port}`);
});
