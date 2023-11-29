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
const tag_1 = require("../entities/tag");
const graphql_1 = require("graphql");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let TagsResolver = class TagsResolver {
    async tags(name) {
        return await tag_1.Tag.find({
            where: { name: name ? (0, typeorm_1.Like)(`%{name}%`) : undefined },
            order: { id: "desc" },
        });
    }
    async createTag(data) {
        const newTag = new tag_1.Tag;
        Object.assign(newTag, data);
        const errors = await (0, class_validator_1.validate)(newTag);
        if (errors.length !== 0)
            throw new graphql_1.GraphQLError("invalid data", { extensions: { errors } });
        const newTagWithId = await newTag.save();
        return newTagWithId;
    }
    async updateTag(id, data) {
        const tagToUpdate = await tag_1.Tag.findOneBy({ id });
        if (!tagToUpdate)
            throw new graphql_1.GraphQLError("Not found");
        Object.assign(tagToUpdate, data);
        return await tagToUpdate.save();
    }
    async deleteTag(id) {
        const tagToDelete = await tag_1.Tag.findOneBy({ id });
        if (!tagToDelete)
            throw new graphql_1.GraphQLError("Not found");
        await tagToDelete.remove();
        return "Deleted";
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [tag_1.Tag]),
    __param(0, (0, type_graphql_1.Arg)("name", { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TagsResolver.prototype, "tags", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => tag_1.Tag),
    __param(0, (0, type_graphql_1.Arg)("data", { validate: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tag_1.NewTagInput]),
    __metadata("design:returntype", Promise)
], TagsResolver.prototype, "createTag", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => tag_1.Tag),
    __param(0, (0, type_graphql_1.Arg)("tagId")),
    __param(1, (0, type_graphql_1.Arg)("data", { validate: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, tag_1.UpdateTagInput]),
    __metadata("design:returntype", Promise)
], TagsResolver.prototype, "updateTag", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("tagId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TagsResolver.prototype, "deleteTag", null);
TagsResolver = __decorate([
    (0, type_graphql_1.Resolver)(tag_1.Tag)
], TagsResolver);
exports.default = TagsResolver;
