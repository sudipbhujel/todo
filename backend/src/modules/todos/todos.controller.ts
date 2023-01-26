import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TodosService } from '@modules/todos/todos.service';
import { CreateTodoDto } from '@modules/todos/dto/create-todo.dto';
import { UpdateTodoDto } from '@modules/todos/dto/update-todo.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Todo } from '@prisma/client';
import { QueryTodoDto } from '@modules/todos/dto/query-todo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '@/types';
import { storage } from '@/config/storage.config';
import { TodoDto } from './dto/todo.dto';

@ApiTags('Todos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage }))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Return created todo.',
    type: TodoDto,
  })
  @ApiUnauthorizedResponse({ description: 'Not authorized' })
  async create(
    @Req() req: RequestWithUser,
    @Body() createTodoDto: CreateTodoDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Todo> {
    return this.todosService.create({
      ...createTodoDto,
      file_url: file?.path ?? null,
      user: {
        connect: { id: req.user.id },
      },
    });
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List all todos of authenticated users.',
    type: TodoDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Not authorized' })
  async findAll(
    @Req() req: RequestWithUser,
    @Query() { q, status }: QueryTodoDto,
  ): Promise<Todo[]> {
    return this.todosService.findAll({
      where: {
        title: { contains: q },
        status: { equals: status },
        user_id: { equals: req.user.id },
        is_deleted: { equals: false },
      },
    });
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Todo with id',
    type: TodoDto,
  })
  @ApiUnauthorizedResponse({ description: 'Not authorized' })
  async findOne(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Todo> {
    return this.todosService.findOne({
      id,
      user_id: req.user.id,
      is_deleted: false,
    });
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', { storage }))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Return created todo.',
    type: TodoDto,
  })
  @ApiUnauthorizedResponse({ description: 'Not authorized' })
  async update(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Todo> {
    return this.todosService.update({
      where: { id, user_id: req.user.id },
      data: { ...updateTodoDto, file_url: file?.path ?? null },
    });
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Return created todo.',
    type: TodoDto,
  })
  @ApiUnauthorizedResponse({ description: 'Not authorized' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
    return this.todosService.remove({ id });
  }
}
