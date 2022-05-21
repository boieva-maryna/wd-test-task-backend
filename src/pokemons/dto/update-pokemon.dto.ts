import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { StorageFile } from '@blazity/nest-file-fastify';
import { Transform } from 'class-transformer';

export class UpdatePokemonDto {
  @IsOptional()
  name: string;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  @IsPositive()
  weight: number;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  @IsPositive()
  height: number;

  @IsOptional()
  image?: StorageFile;
}
