import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from './entity/user.entity';
import { ProfileModel } from './entity/profile.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
  ) {}

  @Patch('users/:id')
  async patchUser(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });

    return this.userRepository.save({
      ...user,
      // title: user.title + '0',
    });
  }

  @Post('users')
  postUser() {
    return this.userRepository.save({});
  }

  @Get('users')
  getUsers() {
    return this.userRepository.find({
      order: {
        id: 'asc',
      },
    });
  }

  @Post('user/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'asd@naver.com',
    });

    const profile = await this.profileRepository.save({
      profileImg: 'asdf.img',
      user,
    });

    return user;
  }

  @Get('usersAndProfile')
  async userAndProfile() {
    return this.userRepository.find({
      relations: {
        profile: true,
      },
    });
  }
}
