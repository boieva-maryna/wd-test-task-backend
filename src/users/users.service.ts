import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<any> {
    const { password, ...user } = await this.prisma.user.create({
      data: {
        ...data,
        password: await bcrypt.hash(data.password, 10),
      },
    });
    return user;
  }
}
