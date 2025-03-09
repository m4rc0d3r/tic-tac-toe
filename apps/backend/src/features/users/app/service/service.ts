import { either as e } from "fp-ts";

import type { HashingService, UsersRepository } from "../ports";
import type { FindOneByOut, ListOut } from "../ports/repository";

import type { CreateIn, CreateOut, FindOneByIn } from "./ios";

import type { UniqueKeyViolationError } from "~/app";
import { NotFoundError } from "~/app";
import type { UserFieldsInUniqueConstraints } from "~/core";

class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashingService: HashingService,
  ) {}

  async create({
    password,
    ...rest
  }: CreateIn): Promise<
    e.Either<UniqueKeyViolationError<UserFieldsInUniqueConstraints>, CreateOut>
  > {
    return await this.usersRepository.create({
      ...rest,
      passwordHash: await this.hashingService.hash(password),
    });
  }

  async findOneBy(params: FindOneByIn): Promise<e.Either<NotFoundError, FindOneByOut>> {
    const filter = "id" in params ? { id: params.id } : { email: params.email };
    const searchResult = await this.usersRepository.findOneBy(filter);

    if ("password" in params && params.password && searchResult._tag === "Right") {
      const comparisonResult = await this.hashingService.compare(
        params.password,
        searchResult.right.passwordHash,
      );
      const newParams = {
        ...params,
      };
      newParams.password = "*".repeat(params.password.length);
      return comparisonResult ? searchResult : e.left(new NotFoundError(newParams));
    }
    return searchResult;
  }

  async list(): Promise<ListOut> {
    return await this.usersRepository.list();
  }
}

export { UsersService };
