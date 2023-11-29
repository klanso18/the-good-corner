"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const ad_1 = require("./entities/ad");
const tag_1 = require("./entities/tag");
const category_1 = require("./entities/category");
exports.default = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "db",
    port: parseInt(process.env.DB_PORT || "0") || 5432,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: process.env.DB_NAME || "postgres",
    entities: [ad_1.Ad, tag_1.Tag, category_1.Category],
    synchronize: true,
    logging: true,
});
