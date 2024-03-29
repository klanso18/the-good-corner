import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Int,
  Ctx,
  Authorized,
} from "type-graphql";
import { Ad, NewAdInput, UpdateAdInput } from "../entities/ad";
import { GraphQLError } from "graphql";
import { validate } from "class-validator";
import { In, Like } from "typeorm";
import { MyContext } from "..";

@Resolver(Ad)
class AdResolver {
  @Authorized()
  @Query(() => [Ad])
  async ads(
    @Arg("tagId", { nullable: true }) tagIds?: string,
    @Arg("categoryId", () => Int, { nullable: true }) categoryId?: number,
    @Arg("title", { nullable: true }) title?: string
  ) {
    return Ad.find({
      relations: { category: true, tags: true },
      where: {
        tags: {
          id:
            typeof tagIds === "string" && tagIds.length > 0
              ? In(tagIds.split(",").map((t) => parseInt(t, 10)))
              : undefined,
        },
        title: title ? Like(`%${title}%`) : undefined,
        category: {
          id: categoryId,
        },
      },
    });
  }

  @Query(() => Ad)
  async getAdById(@Arg("adId", () => Int) id: number) {
    const ad = await Ad.findOne({
      where: { id },
      relations: { category: true, tags: true },
    });
    if (!ad) throw new GraphQLError("Not found");
    return ad;
  }

  @Mutation(() => Ad)
  async createAd(@Arg("data", { validate: true }) data: NewAdInput) {
    const newAd = new Ad();
    Object.assign(newAd, data);
    const errors = await validate(newAd);
    if (errors.length !== 0)
      throw new GraphQLError("invalid data", { extensions: { errors } });
    const { id } = await newAd.save();
    return Ad.findOne({
      where: { id },
      relations: { category: true, tags: true },
    });
  }

  @Mutation(() => Ad)
  async updateAd(
    @Arg("adId") id: number,
    @Arg("data", { validate: true }) data: UpdateAdInput
  ) {
    const adToUpdate = await Ad.findOneBy({ id });
    if (!adToUpdate) throw new GraphQLError("Not found");

    await Object.assign(adToUpdate, data);

    await adToUpdate.save();
    return Ad.findOne({
      where: { id },
      relations: { category: true, tags: true },
    });
  }

  @Mutation(() => String)
  async deleteAd(@Arg("adId") id: number) {
    const adToDelete = await Ad.findOne({ where: { id } });
    if (!adToDelete) throw new GraphQLError("Not found");
    await adToDelete.remove();
    return "Deleted";
  }
}

export default AdResolver;
