import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { StorageFile } from '@blazity/nest-file-fastify';
import { Transform } from 'class-transformer';

export class CreatePokemonDto {
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  weight: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  height: number;

  @IsOptional()
  image?: StorageFile;
}
