"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const ad_1 = require("../entities/ad");
const graphql_1 = require("graphql");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let AdResolver = class AdResolver {
    async ads(tagIds, categoryId, title) {
        return ad_1.Ad.find({
            relations: { category: true, tags: true },
            where: {
                tags: {
                    id: typeof tagIds === "string" && tagIds.length > 0 ? (0, typeorm_1.In)(tagIds.split(",").map((t) => parseInt(t, 10))) : undefined,
                },
                title: title ? (0, typeorm_1.Like)(`%${title}%`) : undefined,
                category: {
                    id: categoryId,
                },
            },
        });
    }
    async getAdById(id) {
        const ad = await ad_1.Ad.findOne({
            where: { id },
            relations: { category: true, tags: true }
        });
        if (!ad)
            throw new graphql_1.GraphQLError("Not found");
        return ad;
    }
    async createAd(data) {
        const newAd = new ad_1.Ad;
        Object.assign(newAd, data);
        const errors = await (0, class_validator_1.validate)(newAd);
        if (errors.length !== 0)
            throw new graphql_1.GraphQLError("invalid data", { extensions: { errors } });
        const { id } = await newAd.save();
        return ad_1.Ad.findOne({
            where: { id },
            relations: { category: true, tags: true },
        });
    }
    async updateAd(id, data) {
        const adToUpdate = await ad_1.Ad.findOneBy({ id });
        if (!adToUpdate)
            throw new graphql_1.GraphQLError("Not found");
        await Object.assign(adToUpdate, data);
        await adToUpdate.save();
        return ad_1.Ad.findOne({
            where: { id },
            relations: { category: true, tags: true },
        });
    }
    async deleteAd(id) {
        const adToDelete = await ad_1.Ad.findOne({ where: { id } });
        if (!adToDelete)
            throw new graphql_1.GraphQLError("Not found");
        await adToDelete.remove();
        return "Deleted";
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [ad_1.Ad]),
    __param(0, (0, type_graphql_1.Arg)("tagId", { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)("categoryId", () => type_graphql_1.Int, { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)("title", { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], AdResolver.prototype, "ads", null);
__decorate([
    (0, type_graphql_1.Query)(() => ad_1.Ad),
    __param(0, (0, type_graphql_1.Arg)("adId", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdResolver.prototype, "getAdById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ad_1.Ad),
    __param(0, (0, type_graphql_1.Arg)("data", { validate: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ad_1.NewAdInput]),
    __metadata("design:returntype", Promise)
], AdResolver.prototype, "createAd", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ad_1.Ad),
    __param(0, (0, type_graphql_1.Arg)("adId")),
    __param(1, (0, type_graphql_1.Arg)("data", { validate: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, ad_1.UpdateAdInput]),
    __metadata("design:returntype", Promise)
], AdResolver.prototype, "updateAd", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("adId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdResolver.prototype, "deleteAd", null);
AdResolver = __decorate([
    (0, type_graphql_1.Resolver)(ad_1.Ad)
], AdResolver);
exports.default = AdResolver;
