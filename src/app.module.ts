import { Module } from '@nestjs/common';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PokemonsModule } from './pokemons/pokemons.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CloudinaryModule,
    AuthModule,
    UsersModule,
    PokemonsModule,
  ],
})
export class AppModule {}
