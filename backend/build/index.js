"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const class_validator_1 = require("class-validator");
const ad_1 = require("./entities/ad");
const tag_1 = require("./entities/tag");
const category_1 = require("./entities/category");
const db_1 = __importDefault(require("./db"));
const typeorm_1 = require("typeorm");
const cors_1 = __importDefault(require("cors"));
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const adResolver_1 = __importDefault(require("./resolvers/adResolver"));
const type_graphql_1 = require("type-graphql");
const tagResolver_1 = __importDefault(require("./resolvers/tagResolver"));
const categoryResolver_1 = __importDefault(require("./resolvers/categoryResolver"));
const app = (0, express_1.default)();
const port = 4000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// CATEGORIES 
app.get("/categories", async (req, res) => {
    try {
        const categories = await category_1.Category.find({
            relations: {
                ads: true
            },
            order: {
                id: "desc"
            }
        });
        res.send(categories);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
app.get("/categories/:id", async (req, res) => {
    try {
        const cat = await category_1.Category.findOneBy({ id: parseInt(req.params.id, 10) });
        if (!cat)
            return res.sendStatus(404);
        res.send(cat);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
app.post("/categories", async (req, res) => {
    try {
        const newCat = category_1.Category.create(req.body);
        const errors = await (0, class_validator_1.validate)(newCat);
        if (errors.length !== 0)
            return res.status(422).send({ errors });
        res.send(await newCat.save());
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
app.delete("/categories/:id", async (req, res) => {
    try {
        const catToDelete = await category_1.Category.findOneBy({ id: parseInt(req.params.id, 10) });
        if (!catToDelete)
            return res.sendStatus(404);
        await catToDelete.remove();
        res.sendStatus(204);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
app.patch("/categories/:id", async (req, res) => {
    try {
        const catToUpdate = await category_1.Category.findOneBy({ id: parseInt(req.params.id, 10) });
        if (!catToUpdate)
            return res.sendStatus(404);
        //await Ad.update(parseInt(req.params.id, 10), req.body);
        await category_1.Category.merge(catToUpdate, req.body);
        const errors = await (0, class_validator_1.validate)(catToUpdate);
        if (errors.length !== 0)
            return res.status(422).send({ errors });
        res.send(await catToUpdate.save());
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
// ADS
app.get("/ads", async (req, res) => {
    const { tagIds } = req.query;
    const title = req.query.title;
    try {
        const ads = await ad_1.Ad.find({
            relations: {
                category: true,
                tags: true,
            },
            where: {
                tags: {
                    id: typeof tagIds === "string" && tagIds.length > 0
                        ? (0, typeorm_1.In)(tagIds.split(",").map((t) => parseInt(t, 10)))
                        : undefined,
                },
                title: title ? (0, typeorm_1.Like)(`%${title}%`) : undefined,
            },
        });
        res.send(ads);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
app.get("/ads/:id", async (req, res) => {
    try {
        const ad = await ad_1.Ad.findOneBy({ id: parseInt(req.params.id, 10) });
        if (!ad)
            return res.sendStatus(404);
        res.send(ad);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
app.post("/ads", async (req, res) => {
    try {
        const newAd = ad_1.Ad.create(req.body);
        const errors = await (0, class_validator_1.validate)(newAd);
        if (errors.length !== 0)
            return res.status(422).send({ errors });
        res.send(await newAd.save());
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
app.patch("/ad/:id", async (req, res) => {
    try {
        const adToUpdate = await ad_1.Ad.findOneBy({ id: parseInt(req.params.id, 10) });
        if (!adToUpdate)
            return res.sendStatus(404);
        //await Ad.update(parseInt(req.params.id, 10), req.body);
        await ad_1.Ad.merge(adToUpdate, req.body);
        const errors = await (0, class_validator_1.validate)(adToUpdate);
        if (errors.length !== 0)
            return res.status(422).send({ errors });
        res.send(await adToUpdate.save());
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
app.delete("/ad/:id", async (req, res) => {
    try {
        const adToDelete = await ad_1.Ad.findOneBy({ id: parseInt(req.params.id, 10) });
        if (!adToDelete)
            return res.sendStatus(404);
        await adToDelete.remove();
        res.sendStatus(204);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
// TAGS 
app.get("/tags", async (req, res) => {
    try {
        const { name } = req.query;
        const tags = await tag_1.Tag.find({
            where: { name: name ? (0, typeorm_1.Like)(`%${name}%`) : undefined },
        });
        res.send(tags);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
app.post("/tag", async (req, res) => {
    try {
        const newTag = tag_1.Tag.create(req.body);
        const errors = await (0, class_validator_1.validate)(newTag);
        if (errors.length !== 0)
            return res.status(422).send({ errors });
        res.send(await newTag.save());
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
app.delete("/tag/:id", async (req, res) => {
    try {
        const tagToDelete = await tag_1.Tag.findOneBy({
            id: parseInt(req.params.id, 10),
        });
        if (!tagToDelete)
            return res.sendStatus(404);
        await tagToDelete.remove();
        res.sendStatus(204);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
app.listen(port, async () => {
    await db_1.default.initialize();
    console.log(`Server lauch on port ${port}`);
});
(0, type_graphql_1.buildSchema)({
    resolvers: [adResolver_1.default, tagResolver_1.default, categoryResolver_1.default],
}).then((schema) => {
    const server = new server_1.ApolloServer({ schema });
    (0, standalone_1.startStandaloneServer)(server, {
        listen: { port: 4001 },
    }).then(({ url }) => console.log(`🚀 GraphQL server listening on ${url}`));
});
