import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from './entity/user.entity';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(TagModel)
    private readonly TagRepository: Repository<TagModel>,
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
      profile: {
        profileImg: 'asdf.img',
      },
    });

    // const profile = await this.profileRepository.save({
    //   profileImg: 'asdf.img',
    //   user,
    // });

    return user;
  }

  @Delete('user/profile/:id')
  async deleteProfile(@Param('id') id: string) {
    await this.profileRepository.delete(+id);
  }

  @Get('usersAndRelation')
  async userAndProfile() {
    return this.userRepository.find({
      order: {
        id: 'asc',
      },
    });
  }

  @Post('user/post')
  async createUserAndPost() {
    const user = await this.userRepository.save({
      email: 'postmodel@naver.com',
    });

    await this.postRepository.save({
      author: user,
      title: 'post 1',
    });

    await this.postRepository.save({
      author: user,
      title: 'post 2',
    });

    return user;
  }

  @Post('posts/tags')
  async createPostsTags() {
    const post1 = await this.postRepository.save({
      title: 'latte',
    });

    const post2 = await this.postRepository.save({
      title: 'amricano',
    });

    const tag1 = await this.TagRepository.save({
      name: 'shot',
      posts: [post1, post2],
    });

    const tag2 = await this.TagRepository.save({
      name: 'milk',
      posts: [post1],
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const post3 = await this.postRepository.save({
      title: 'capuccino',
      tags: [tag1, tag2],
    });
  }

  @Get('posts')
  async getPostsAndTags() {
    return await this.postRepository.find({
      relations: {
        tags: true,
      },
      order: {
        id: 'asc',
      },
    });
  }
  @Get('tags')
  async getTagsAndPost() {
    return await this.TagRepository.find({
      relations: {
        posts: true,
      },
      order: {
        id: 'asc',
      },
    });
  }
}
