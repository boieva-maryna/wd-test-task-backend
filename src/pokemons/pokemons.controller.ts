import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Pokemon } from '@prisma/client';
import { Public } from 'src/decorators/public.decorator';
import { SearchPokemonsDto, SortOrder } from './dto/search-pokemons.dto';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import {
  StorageFile,
  FileInterceptor,
  UploadedFile,
} from '@blazity/nest-file-fastify';

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Public()
  @Get()
  async search(
    @Query()
    {
      page = 0,
      limit = 10,
      name = '',
      order = SortOrder.DESC,
      orderBy = 'name',
      rangeBy,
      rangeFrom,
      rangeTo,
    }: SearchPokemonsDto,
  ) {
    const search = { name: { search: name } };
    const range = {
      [rangeBy]: {
        ...(rangeTo ? { lte: rangeTo } : {}),
        ...(rangeFrom ? { gte: rangeFrom } : {}),
      },
    };
    return this.pokemonsService.pokemons({
      skip: page * limit,
      take: limit,
      where: {
        ...(rangeBy && name
          ? { AND: [search, range] }
          : rangeBy
          ? range
          : name
          ? search
          : {}),
      },
      orderBy: {
        [orderBy]: order,
      },
    });
  }

  @Public()
  @Get(':id')
  async getOne(@Param('id', new ParseIntPipe()) id: number): Promise<Pokemon> {
    return this.pokemonsService.pokemon({ id });
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: StorageFile,
    @Body() createPokemonDto: CreatePokemonDto,
  ) {
    createPokemonDto.image = file;

    if (await this.pokemonsService.pokemon({ name: createPokemonDto.name })) {
      throw new BadRequestException(
        'Pokemon with the provided name already exists',
      );
    }
    return this.pokemonsService.createPokemon(createPokemonDto);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updatePokemonDto: UpdatePokemonDto,
    @UploadedFile() file: StorageFile,
  ) {
    updatePokemonDto.image = file;

    if (!(await this.pokemonsService.pokemon({ id }))) {
      throw new NotFoundException();
    }

    if (
      updatePokemonDto.name &&
      (await this.pokemonsService.pokemon({ name: updatePokemonDto.name }))
    ) {
      throw new BadRequestException(
        'Pokemon with the provided name already exists',
      );
    }
    return this.pokemonsService.updatePokemon({
      where: { id },
      data: updatePokemonDto,
    });
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    if (!(await this.pokemonsService.pokemon({ id }))) {
      throw new NotFoundException();
    }

    return this.pokemonsService.deletePokemon({
      id,
    });
  }
}
