import { PrismaService } from '@modules/database/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Todo, Prisma } from '@prisma/client';

@Injectable()
export class TodosService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.TodoCreateInput): Promise<Todo> {
    return this.prismaService.todo.create({ data });
  }

  async findAll(params: { where?: Prisma.TodoWhereInput }): Promise<Todo[]> {
    const { where } = params;
    return this.prismaService.todo.findMany({
      where,
    });
  }

  async findOne(todoWhereInput: Prisma.TodoWhereInput) {
    const todo = await this.prismaService.todo.findFirst({
      where: todoWhereInput,
    });

    if (!todo) throw new HttpException('Todo not found.', HttpStatus.NOT_FOUND);

    return todo;
  }

  async update(params: {
    where: Prisma.TodoWhereInput;
    data: Prisma.TodoUpdateInput;
  }) {
    const { where, data } = params;
    const { id } = where;
    const todo = await this.prismaService.todo.findFirst({
      where,
    });

    if (!todo)
      throw new HttpException(
        `Todo with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );

    if (todo.status === 'completed') {
      throw new HttpException(
        "You can't update completed todo",
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return this.prismaService.todo.update({
      where: { id: parseInt(id?.toString()) },
      data,
    });
  }

  async remove(where: Prisma.TodoWhereUniqueInput) {
    return this.prismaService.todo.update({
      where,
      data: { is_deleted: true },
    });
  }
}
