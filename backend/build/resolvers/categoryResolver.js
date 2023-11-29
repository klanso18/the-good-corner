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
const category_1 = require("../entities/category");
const type_graphql_1 = require("type-graphql");
const graphql_1 = require("graphql");
const typeorm_1 = require("typeorm");
let CategoryResolver = class CategoryResolver {
    async categories(name) {
        return await category_1.Category.find({
            where: { name: name ? (0, typeorm_1.Like)(`%{name}%`) : undefined },
            order: { id: "desc" },
        });
    }
    async createCategory(data) {
        const newCategory = new category_1.Category();
        Object.assign(newCategory, data);
        const newCategoryWithId = await newCategory.save();
        return newCategoryWithId;
    }
    async updateCat(id, data) {
        const categoryToUpdate = await category_1.Category.findOneBy({ id });
        if (!categoryToUpdate)
            throw new graphql_1.GraphQLError("Not found");
        Object.assign(categoryToUpdate, data);
        return await categoryToUpdate.save();
    }
    async deleteCategory(id) {
        const categoryToDelete = await category_1.Category.findOne({ where: { id } });
        if (!categoryToDelete)
            throw new graphql_1.GraphQLError("Not found");
        await categoryToDelete.remove();
        return "Deleted";
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [category_1.Category]),
    __param(0, (0, type_graphql_1.Arg)("name", { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "categories", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => category_1.Category),
    __param(0, (0, type_graphql_1.Arg)("data", { validate: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_1.NewCategoryInput]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "createCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => category_1.Category),
    __param(0, (0, type_graphql_1.Arg)("categoryId")),
    __param(1, (0, type_graphql_1.Arg)("data", { validate: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, category_1.UpdateCategoryInput]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "updateCat", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("categoryId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "deleteCategory", null);
CategoryResolver = __decorate([
    (0, type_graphql_1.Resolver)(category_1.Category)
], CategoryResolver);
exports.default = CategoryResolver;
