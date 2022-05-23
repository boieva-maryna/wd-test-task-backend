import { Transform } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsNumber, IsOptional } from 'class-validator';

export enum SortOrder {
  DESC = 'desc',
  ASC = 'asc',
}

export class SearchPokemonsDto {
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  page?: number;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  limit?: number;

  @IsOptional()
  name?: string;

  @IsOptional()
  @IsIn(['name', 'weight', 'height'])
  orderBy?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  order: SortOrder;

  @IsOptional()
  @IsIn(['weight', 'heiht'])
  rangeBy?: string;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  rangeFrom?: number;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  rangeTo?: number;
}
