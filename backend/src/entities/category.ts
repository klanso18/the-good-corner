import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Field, ObjectType, Int, InputType } from 'type-graphql';
import { Ad } from "./ad";
import { Length } from "class-validator";

@Entity()
@ObjectType()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @OneToMany(() => Ad, (ad) => ad.category)
  ads: Ad[];
}

@InputType()
export class NewCategoryInput {
  @Field()
  @Length(2, 30, { message: "Le nom doit contenir entre 2 et 30 caractères" })
  name: string;
}

@InputType()
export class UpdateCategoryInput {
  @Field()
  @Length(2, 30, { message: "Le nom doit contenir entre 2 et 30 caractères" })
  name: string;
}