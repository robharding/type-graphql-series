import {
  Resolver,
  Mutation,
  Arg,
  ClassType,
  Field,
  InputType
} from "type-graphql";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { Product } from "../../entity/Product";

function createBaseResolver<T extends ClassType, X extends ClassType>(
  suffix: string,
  returnType: T,
  inputType: X,
  entity: any
) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    @Mutation(() => returnType, { name: `create${suffix}` })
    async create(
      @Arg("data", () => inputType) data: any
    ): Promise<typeof returnType> {
      return entity.create(data).save();
    }
  }

  return BaseResolver;
}

@InputType()
class ProductInput {
  @Field()
  name: string;
}

const BaseCreateUser = createBaseResolver("User", User, RegisterInput, User);
const BaseCreateProduct = createBaseResolver(
  "Product",
  Product,
  ProductInput,
  Product
);

@Resolver()
export class CreateUserResolver extends BaseCreateUser {}

@Resolver()
export class CreateProductResolver extends BaseCreateProduct {}
