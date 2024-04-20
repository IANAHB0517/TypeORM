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
      email: user.email + '0',
    });
  }

  @Post('users')
  postUser() {
    return this.userRepository.save({});
  }

  @Get('users')
  getUsers() {
    return this.userRepository.find({
      // 어떤 프로퍼티를 선택할지
      // select를 정의 하지 않았을 경우 기본은 *
      // select를 정의 하면 선택한 컬럼만을 가져온다
      select: {
        // id: true,
        // createdAt: true,
        // updatedAt: true,
        // version: true,
      },
      // 필터링할 조건을 입력하게 된다.
      // 전부다 and 연산이 된다
      // or 연산을 하고자 하는 경우에는 or 연산이 필요한 절을 list로 제공해야하 한다
      // 리스트 안에서 and 연산되어야 하는 항목끼리 객체로 묶어준다.
      where: [
        // {
        //   // id: 3,
        //   version: 1,
        // },
        // { id: 3 },
        // { profile: { id: 3 } },
      ],
      // 관계를 가져오븐 법
      // join 이라고 생각하자
      // relations 속성을 사용하면 select 절이나 where 절 등 다른 곳에서 해당 속성의 컬럼을 사용 할 수 있다.
      relations: {
        profile: true,
      },
      // 정렬 순서
      // asc , desc
      order: {
        id: 'asc',
      },
      // skip 처음 몇개를 제외할질,
      skip: 0,
      // 총 몇개를 가지고 올지 정하는 프로퍼티
      // 페이지네이션에 유용할 듯하다
      // 기본 값은 전체 결과 값이다.

      // skip 과 take의 값을 동적으로 사용하여 페이지네이션에 활용하기 좋을 것 같다
      take: 4,
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
