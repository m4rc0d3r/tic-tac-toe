import { either as e } from "fp-ts";

import type { BlobService, HashingService, UsersRepository } from "../ports";
import type { FindOneByOut, ListOut, UpdateOut } from "../ports/repository";

import type { CreateIn, CreateOut, FindOneByIn, UpdateIn } from "./ios";

import type { UniqueKeyViolationError } from "~/app";
import { NotFoundError } from "~/app";
import type { UserFieldsInUniqueConstraints } from "~/core";

class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashingService: HashingService,
    private readonly blobService: BlobService,
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

  async update({
    avatar,
    password,
    ...rest
  }: UpdateIn): Promise<
    e.Either<UniqueKeyViolationError<UserFieldsInUniqueConstraints> | NotFoundError, UpdateOut>
  > {
    const newData: Parameters<typeof this.usersRepository.update>[0] = rest;
    if (password) {
      newData.passwordHash = await this.hashingService.hash(password);
    }
    if (avatar !== undefined) {
      const searchResult = await this.usersRepository.findOneBy({
        id: rest.id,
      });
      if (searchResult._tag === "Left") {
        return searchResult;
      }
      const { avatar: currentAvatar } = searchResult.right;
      if (currentAvatar) {
        await this.blobService.delete(currentAvatar);
      }
      newData.avatar = avatar instanceof File ? await this.blobService.upload(avatar) : avatar;
    }

    return this.usersRepository.update(newData);
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
