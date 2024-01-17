import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import {
  InputLogin,
  InputRegister,
  User,
  UserWithoutPassword,
  Message,
} from "../entities/user";
import * as argon2 from "argon2";
import { SignJWT } from "jose";
import { MyContext } from "..";
import Cookies from "cookies";

@Resolver()
class UserResolver {
  @Query(() => [User])
  async users() {
    return await User.find();
  }

  @Mutation(() => UserWithoutPassword)
  async register(@Arg("data") data: InputRegister) {
    const user = await User.findOneBy({ email: data.email });
    if (user) {
      throw new Error("Cet email n'est pas disponible.");
    }
    const newUser = new User();
    Object.assign(newUser, data);
    const { id } = await newUser.save();
    return User.findOne({
      where: { id },
    });
  }

  @Query(() => Message)
  async login(@Arg("data") data: InputLogin, @Ctx() ctx: MyContext) {
    const user = await User.findOneBy({ email: data.email });
    if (!user) {
      throw new Error("Vérifiez vos informations.");
    }
    const isPasswordIsValid = await argon2.verify(user.password, data.password);
    const message = new Message();
    if (isPasswordIsValid) {
      const token = await new SignJWT({ email: user.email })
        .setProtectedHeader({ alg: "HS256", typ: "jwt" })
        .setExpirationTime("2h")
        .sign(new TextEncoder().encode(`${process.env.SECRET_KEY}`));

      let cookies = new Cookies(ctx.req, ctx.res);
      cookies.set("token", token, { httpOnly: true });

      message.message = "Bienvenue !";
      message.success = true;
    } else {
      message.message = "Vérifiez vos informations.";
      message.success = false;
    }
    return message;
  }

  @Query(() => Message)
  async logout(@Ctx() ctx: MyContext) {
    if (ctx.user) {
      let cookies = new Cookies(ctx.req, ctx.res);
      cookies.set("token");
    }
    const message = new Message();
    message.message = "Vous avez été déconnecté";
    message.success = true;
    return message;
  }
}

export default UserResolver;
