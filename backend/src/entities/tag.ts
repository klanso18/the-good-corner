import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { ObjectType, Field, InputType, Int } from "type-graphql";
import { Length } from "class-validator";
import { Ad } from "./ad";

@Entity()
@ObjectType()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Length(2, 50)
  @Field()
  name: string;

  @ManyToMany(() => Ad, (ad) => ad.tags)
  ads: Ad[];
}

@InputType ()
export class NewTagInput {
  @Length(2, 30, { message: "Le nom doit contenir entre 2 et 30 caractères" })
  @Field()
  name: string;
}

@InputType ()
export class UpdateTagInput {
  @Length(2, 30, { message: "Le nom doit contenir entre 2 et 30 caractères" })
  @Field({ nullable: true })
  name: string;
}