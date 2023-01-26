import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TodoDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Buy Grocerries' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Visit nerby shop' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '/location' })
  @IsOptional()
  file_url?: string;

  @ApiPropertyOptional({ example: 'not started' })
  @IsOptional()
  @IsString()
  status?: string;
}
