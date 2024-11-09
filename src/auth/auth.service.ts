import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async Login(dto: AuthDto) {
    try {
      const hash = await argon2.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new ForbiddenException('Creadentials already exists');
        throw error;
      }
    }
  }
  async SignUp(dto: AuthDto) {
    try {
      //find user by email
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      //is user does not exist throw an error
      if(!user) throw new ForbiddenException('Incorrect Credentials')

      // compare passwords
      const passwordMatch=await argon2.verify(user.hash,dto.password)

      //if password incorect throw exception
       if(!passwordMatch) throw new ForbiddenException('Incorrect Credentials')

      //send back user
      delete user.hash
      return user;
    } catch (error) {
      if(error instanceof PrismaClientKnownRequestError){
        if(error.code === 'P2002') throw new ForbiddenException('Incorrect Credentials')
      }
    }

  }
}
