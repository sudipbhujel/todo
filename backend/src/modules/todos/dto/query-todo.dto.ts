import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryTodoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  q: string;

  @ApiPropertyOptional({ example: 'not started' })
  @IsOptional()
  @IsString()
  status: string;
}
