import { PrismaService } from '@modules/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({ data });
  }

  async findAll(params: { where?: Prisma.UserWhereInput }): Promise<User[]> {
    const { where } = params;
    return this.prismaService.user.findMany({
      where,
    });
  }

  async findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    const { where, data } = params;
    return this.prismaService.user.update({
      where,
      data,
    });
  }

  async remove(where: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.delete({
      where,
    });
  }
}
