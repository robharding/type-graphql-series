import { Resolver, Query, Ctx, UseMiddleware } from "type-graphql";

import { User } from "../../entity/User";
import { MyContext } from "src/types/MyContext";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    return User.findOne(ctx.req.session!.userId);
  }
}
