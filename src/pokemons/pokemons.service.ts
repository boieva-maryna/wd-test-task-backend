import { Injectable } from '@nestjs/common';
import { Prisma, Pokemon } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async pokemon(
    pokemonWhereUniqueInput: Prisma.PokemonWhereUniqueInput,
  ): Promise<Pokemon | null> {
    return this.prisma.pokemon.findUnique({
      where: pokemonWhereUniqueInput,
    });
  }

  async pokemons(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PokemonWhereUniqueInput;
    where?: Prisma.PokemonWhereInput;
    //@ts-ignore
    orderBy?: Prisma.PokemonOrderByInput;
  }): Promise<{ data: Pokemon[]; total: number }> {
    const { skip, take, cursor, where, orderBy } = params;
    const data = await this.prisma.pokemon.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    const total = await this.prisma.pokemon.count({
      where,
      orderBy,
    });

    return { data, total };
  }

  async createPokemon(pkemonDto: CreatePokemonDto): Promise<Pokemon> {
    const { image, ...data } = pkemonDto;

    const pokemon = await this.prisma.pokemon.create({
      data,
    });

    if (image) {
      const { url } = await this.cloudinary.uploadImage(image, {
        public_id: `${pokemon.id}`,
        folder: 'pokemons',
        resource_type: 'image',
      });

      return this.prisma.pokemon.update({
        data: { imageUrl: url },
        where: { id: pokemon.id },
      });
    }

    return pokemon;
  }

  async updatePokemon(params: {
    where: Prisma.PokemonWhereUniqueInput;
    data: UpdatePokemonDto;
  }): Promise<Pokemon> {
    const { where } = params;

    const { image, ...data } = params.data;

    if (image) {
      const { url } = await this.cloudinary.uploadImage(image, {
        public_id: `${where.id}`,
        folder: 'pokemons',
        resource_type: 'image',
      });
      (data as Prisma.PokemonUpdateInput).imageUrl = url;
    }
    return this.prisma.pokemon.update({
      data,
      where,
    });
  }

  async deletePokemon(where: Prisma.PokemonWhereUniqueInput) {
    await this.prisma.pokemon.delete({
      where,
    });

    await this.cloudinary.removeImage(`${where.id}`);
    return;
  }
}
