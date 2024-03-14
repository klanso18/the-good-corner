import { Field, InputType, ObjectType } from "type-graphql";
import * as argon2 from "argon2";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await argon2.hash(this.password);
    } else {
      throw new Error("Password is required.");
    }
  }

  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;
}

@ObjectType()
export class UserWithoutPassword {
  @Field()
  id: string;

  @Field()
  email: string;
}

@InputType()
export class InputRegister {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class Message {
  @Field()
  success: boolean;

  @Field()
  message: string;
}

@InputType()
export class InputLogin {
  @Field()
  email: string;

  @Field()
  password: string;
}
