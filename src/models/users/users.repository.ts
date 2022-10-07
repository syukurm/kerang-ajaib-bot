import type { User } from "@prisma/client";
import { Service } from "typedi";

import PrismaService from "../../providers/prisma.service";
import KerangAjaibError from "../../shared/errors/KerangAjaibError";
import type { PromiseResult } from "../../shared/types";

@Service()
export default class UsersRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findOne(id: string): PromiseResult<User> {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: { id },
      });

      return [user, null];
    } catch (error: unknown) {
      if (error instanceof Error) return [null, error];
      return [null, new KerangAjaibError("Something went wrong while trying to find user", error)];
    }
  }

  public async create(id: string, tag: string): PromiseResult<User> {
    try {
      const user = await this.prismaService.user.create({ data: { id, tag } });
      return [user, null];
    } catch (error: unknown) {
      if (error instanceof Error) return [null, error];
      return [null, new KerangAjaibError("Something went wrong while trying to create user", error)];
    }
  }

  public async bumpCount(id: string): PromiseResult<User> {
    try {
      const [user, error] = await this.findOne(id);

      if (error !== null) throw error;

      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: { askingCounts: user.askingCounts + 1 },
      });

      return [updatedUser, null];
    } catch (error: unknown) {
      if (error instanceof Error) return [null, error];
      return [null, new KerangAjaibError("Something went wrong while trying to bumpCount in User", error)];
    }
  }
}
