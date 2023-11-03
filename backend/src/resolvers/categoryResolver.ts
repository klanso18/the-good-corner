import { Category, NewCategoryInput, UpdateCategoryInput } from "../entities/category";
import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { GraphQLError } from "graphql";
import { Like } from "typeorm";

@Resolver(Category)
class CategoryResolver {

  @Query(() => [Category])
  async categories(@Arg("name", { nullable: true }) name: string) {
    return await Category.find({
      where: { name: name ? Like(`%{name}%`) : undefined },
      order: { id: "desc" },
    });
  }

  @Mutation(() => Category)
  async createCategory(
    @Arg("data", { validate: true }) data: NewCategoryInput
  ) {
    const newCategory = new Category();
    Object.assign(newCategory, data);
    const newCategoryWithId = await newCategory.save();
    return newCategoryWithId;
  }

  @Mutation(() => Category)
  async updateCat(
    @Arg("categoryId") id: number,
    @Arg("data", { validate: true }) data: UpdateCategoryInput
  ) {
    const categoryToUpdate = await Category.findOneBy({ id });
    if (!categoryToUpdate) throw new GraphQLError("Not found");
    Object.assign(categoryToUpdate, data);
    return await categoryToUpdate.save();
  }

  @Mutation(() => String)
  async deleteCategory(@Arg("categoryId") id: number) {
    const categoryToDelete = await Category.findOne({ where: { id }});
    if (!categoryToDelete) throw new GraphQLError("Not found");
    await categoryToDelete.remove();
    return "Deleted";
  }

}

export default CategoryResolver;