import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserJWTPayload } from 'src/auth/types';
import { JWTPayload } from 'src/decorators/jwt-payload.decorator';
import { Public } from 'src/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('current')
  async getCurrent(@JWTPayload() user: UserJWTPayload) {
    return user;
  }

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<Partial<User>> {
    if (await this.usersService.findByEmail(createUserDto.email)) {
      throw new BadRequestException(
        `User with the provided email already exists`,
      );
    }
    return await this.usersService.create(createUserDto);
  }
}
