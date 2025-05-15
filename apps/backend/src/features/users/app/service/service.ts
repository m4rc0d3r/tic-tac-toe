import { either as e, function as f } from "fp-ts";

import type { BlobService, HashingService, UsersRepository } from "../ports";
import type {
  CreateOut,
  FindOneByOut,
  FindOneWithLastOnlineDateIn,
  FindOneWithLastOnlineDateOut,
  ListOut,
} from "../ports/repository";

import type {
  CreateIn,
  FindOneByIn,
  UpdateCredentialsIn,
  UpdateCredentialsOut,
  UpdatePersonalDataIn,
  UpdatePersonalDataOut,
} from "./ios";

import type { UniqueKeyViolationError } from "~/app";
import { NotFoundError } from "~/app";
import type { UserFieldsInUniqueConstraints } from "~/core";

const PASSWORD = "password";

class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashingService: HashingService,
    private readonly blobService: BlobService,
  ) {}

  async create(
    params: CreateIn,
  ): Promise<e.Either<UniqueKeyViolationError<UserFieldsInUniqueConstraints>, CreateOut>> {
    if (PASSWORD in params) {
      const { password, ...rest } = params;
      return await this.usersRepository.create({
        ...rest,
        passwordHash: await this.hashingService.hash(password),
      });
    } else {
      return await this.usersRepository.create(params);
    }
  }

  async updatePersonalData(
    params: UpdatePersonalDataIn,
  ): Promise<
    e.Either<
      UniqueKeyViolationError<UserFieldsInUniqueConstraints> | NotFoundError,
      UpdatePersonalDataOut
    >
  > {
    const { avatar, ...rest } = params;
    type DataForUpdate = Parameters<typeof this.usersRepository.update>[0];
    const newData: DataForUpdate = rest;
    let newAvatar: DataForUpdate["avatar"] = undefined;

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
      newAvatar = avatar instanceof File ? await this.blobService.upload(avatar) : avatar;
    }

    return this.usersRepository.update({
      ...newData,
      ...(typeof newAvatar === "string" && { avatar: newAvatar }),
    });
  }

  async updateCredentials({
    password,
    ...rest
  }: UpdateCredentialsIn): Promise<
    e.Either<
      UniqueKeyViolationError<UserFieldsInUniqueConstraints> | NotFoundError,
      UpdateCredentialsOut
    >
  > {
    type DataForUpdate = Parameters<typeof this.usersRepository.update>[0];
    const newData: DataForUpdate = rest;
    let newPasswordHash: Extract<
      DataForUpdate,
      {
        passwordHash?: string | undefined;
      }
    >["passwordHash"] = undefined;

    if (typeof password === "string") {
      newPasswordHash = await this.hashingService.hash(password);
    }

    const { id } = rest;

    return f.pipe(
      await this.usersRepository.update({
        ...newData,
        ...(typeof newPasswordHash === "string" && { passwordHash: newPasswordHash }),
      }),
      e.flatMap((value) =>
        value.registrationStatus === "FULL"
          ? e.right(value)
          : e.left(
              new NotFoundError({
                id,
              }),
            ),
      ),
    );
  }

  async findOneBy(params: FindOneByIn): Promise<e.Either<NotFoundError, FindOneByOut>> {
    const filter = "id" in params ? { id: params.id } : { email: params.email };
    const searchResult = await this.usersRepository.findOneBy(filter);

    if (!(PASSWORD in params && typeof params[PASSWORD] === "string")) {
      return searchResult;
    }

    const newParams = {
      ...params,
    };
    newParams[PASSWORD] = "*".repeat(params[PASSWORD].length);

    if (!(searchResult._tag === "Right" && searchResult.right.registrationStatus === "FULL")) {
      return e.left(new NotFoundError(newParams));
    }

    const comparisonResult = await this.hashingService.compare(
      params[PASSWORD],
      searchResult.right.passwordHash,
    );
    return comparisonResult ? searchResult : e.left(new NotFoundError(newParams));
  }

  async findOneWithLastOnlineDate(
    params: FindOneWithLastOnlineDateIn,
  ): Promise<e.Either<NotFoundError, FindOneWithLastOnlineDateOut>> {
    return await this.usersRepository.findOneWithLastOnlineDate(params);
  }

  async list(): Promise<ListOut> {
    return await this.usersRepository.list();
  }
}

export { UsersService };
