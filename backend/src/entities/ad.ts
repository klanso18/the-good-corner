import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Category } from "./category";
import { Tag } from "./tag";
import { Length, Min } from "class-validator";

@Entity()
export class Ad extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  @Length(5, 50, { message: "Le titre doit contenir entre 5 et 50 caractères" })
  title: string;

  @Column({ nullable: true, type: "text" })
  description:string;

  @Column()
  owner: string;

  @Column({ type: "float" })
  @Min(0, { message: "Le prix doit être positif" })
  price: number;

  @Column({ nullable: true })
  picture: string;

  @Column()
  location: string;

  @CreateDateColumn()
  createdAt: string;

  @ManyToOne (() => Category, (c) => c.ads, { cascade: true })
  category: Category;

  @JoinTable()
  @ManyToMany(() => Tag, (t) => t.ads, { cascade: true })
  tags: Tag[];
}