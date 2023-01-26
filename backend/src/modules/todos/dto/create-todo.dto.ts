import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ example: 'Buy Grocerries' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Visit nerby shop' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  file?: any;

  @ApiPropertyOptional({ example: 'not started' })
  @IsOptional()
  @IsString()
  status?: string;
}
