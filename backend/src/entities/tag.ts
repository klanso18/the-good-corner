import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Length } from "class-validator";
import { Ad } from "./ad";

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(2, 50)
  name: string;

  @ManyToMany(() => Ad, (ad) => ad.tags)
  ads: Ad[];
}