import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../entity/User";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";
import { redis } from "../../redis";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";
import { MyContext } from "src/types/MyContext";

@Resolver()
export class ChangePasswordResolver {
	@Mutation(() => User, { nullable: true })
	async changePassword(
		@Arg("data")
		{ token, password }: ChangePasswordInput,
		@Ctx() ctx: MyContext
	): Promise<User | null> {
		// Find uid with given token in redis
		const userId = await redis.get(forgotPasswordPrefix + token);
		if (!userId) {
			return null;
		}
		await redis.del(forgotPasswordPrefix + token);

		// Find user in db with uid
		const user = await User.findOne(userId);
		if (!user) {
			return null;
		}

		// Update user password
		user.password = await bcrypt.hash(password, 12);
		await user.save();

		// Log the user in
		ctx.req.session!.userId = user.id;

		return user;
	}
}
