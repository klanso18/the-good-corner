import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Category } from "./category";
import { Tag } from "./tag";
import { Length, Min } from "class-validator";
import { Field, ObjectType, Int, InputType } from 'type-graphql';
import { ObjectId } from "../utils";

@Entity()
@ObjectType()
export class Ad extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ length: 50 })
  @Length(5, 50, { message: "Le titre doit contenir entre 5 et 50 caractères" })
  @Field()
  title: string;

  @Column({ nullable: true, type: "text" })
  @Field()
  description:string;

  @Column()
  @Field()
  owner: string;

  @Column({ type: "float" })
  @Min(0, { message: "Le prix doit être positif" })
  @Field()
  price: number;

  @Column({ nullable: true })
  @Field()
  picture: string;

  @Column()
  @Field()
  location: string;

  @CreateDateColumn()
  @Field()
  createdAt: string;

  @ManyToOne (() => Category, (c) => c.ads, { cascade: true })
  @Field()
  category: Category;

  @JoinTable()
  @ManyToMany(() => Tag, (t) => t.ads, { cascade: true })
  @Field(() => [Tag])
  tags: Tag[];
}

@InputType ()
export class NewAdInput {
  @Length(5, 50, { message: "Le titre doit contenir entre 5 et 50 caractères" })
  @Field()
  title: string;

  @Field()
  description:string;

  @Field()
  owner: string;

  @Min(0, { message: "Le prix doit être positif" })
  @Field()
  price: number;

  @Field()
  picture: string;

  @Field()
  location: string;

  @Field(() => ObjectId)
  category: ObjectId;

  @Field(() => [ObjectId], { nullable: true })
  tags: ObjectId[];
}

@InputType ()
export class UpdateAdInput {
  @Length(5, 50, { message: "Le titre doit contenir entre 5 et 50 caractères" })
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description:string;

  @Field({ nullable: true })
  owner: string;

  @Min(0, { message: "Le prix doit être positif" })
  @Field({ nullable: true })
  price: number;

  @Field({ nullable: true })
  picture: string;

  @Field({ nullable: true })
  location: string;

  @Field(() => ObjectId, { nullable: true })
  category: ObjectId;

  @Field(() => [ObjectId], { nullable: true })
  tags: ObjectId[];
}

