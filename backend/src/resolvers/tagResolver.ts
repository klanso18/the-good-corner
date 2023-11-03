import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { NewTagInput, Tag, UpdateTagInput } from "../entities/tag";
import { GraphQLError } from "graphql";
import { validate } from "class-validator";
import { Like } from "typeorm";

@Resolver(Tag)
class TagsResolver {

  @Query(() => [Tag])
  async tags(@Arg("name", { nullable: true }) name: string) {
    return await Tag.find({
      where: { name: name ? Like(`%{name}%`) : undefined },
      order: { id: "desc" },
    });
  }

  @Mutation(() => Tag)
  async createTag(@Arg("data", { validate: true }) data: NewTagInput) {
    const newTag = new Tag;
    Object.assign(newTag, data);
    const errors = await validate(newTag);
    if (errors.length !== 0)
      throw new GraphQLError("invalid data", { extensions: { errors } });
    const newTagWithId = await newTag.save();
    return newTagWithId;
  }

  @Mutation(() => Tag)
  async updateTag(
    @Arg("tagId") id: number,
    @Arg("data", { validate: true }) data: UpdateTagInput
  ) {
    const tagToUpdate = await Tag.findOneBy({ id });
    if (!tagToUpdate) throw new GraphQLError("Not found");
    Object.assign(tagToUpdate, data);
    return await tagToUpdate.save();
  }

  @Mutation(() => String)
  async deleteTag(@Arg("tagId") id: number) {
    const tagToDelete = await Tag.findOneBy({ id });
    if (!tagToDelete) throw new GraphQLError("Not found");
    await tagToDelete.remove();
    return "Deleted";
  }

}

export default TagsResolver;