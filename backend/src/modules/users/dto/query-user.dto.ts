import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  q: string;
}
