import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, Min, IsOptional, Max } from 'class-validator';

export interface IBasePaginationRequest {
  page?: number;
  size?: number;
}

export interface IBasePaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
}

export class BasePaginationRequest implements IBasePaginationRequest {
  @ApiPropertyOptional({ example: 1 })
  @Expose()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @Expose()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  size?: number;
}

export class BasePaginationResponse<T> implements IBasePaginationResponse<T> {
  @ApiProperty()
  @Expose()
  data: T[];

  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  page: number;

  @ApiProperty()
  @Expose()
  size: number;
}
