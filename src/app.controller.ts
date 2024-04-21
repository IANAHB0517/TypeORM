import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Equal,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { UserModel } from './entity/user.entity';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';
import { sample, max } from 'rxjs';

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
  async postUser() {
    for (let i = 0; i < 100; i++) {
      await this.userRepository.save({
        email: `user-${i}@google.com`,
      });
    }
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
      where:
        // [
        // {
        //   // id: 3,
        //   version: 1,
        // },
        // { id: 3 },
        // { profile: { id: 3 } },
        // ],
        {
          // 파라미터의 값과 같지 않은 경우 가져오기
          // id: Not(1)
          // 파라미터의 값보다 작은 경우 가져오기
          // id: LessThan(30),
          // 파라미터의 값보다 작거나 같은 경우 가져오기
          // id: LessThanOrEqual(30),
          // 값보다 더 큰 경우
          // id: MoreThan(30),
          // 값보다 더 크거나 같은 경우
          // id: MoreThanOrEqual(30),
          // 값과 같은 경우
          // id: Equal(30),
          // 유사값 (oracle 과 동일하게 쓰임)
          // email: Like('%google%'),
          // 대문자, 소문자 구분 안하는 유사값
          // email: ILike('%GOOGLE%)
          // 사이값
          // id: Between(10, 15)
          // 해당되는 여러개의 값
          // id: In([1, 3, 5, 8, 55]),
          // 해당 컬럼이 null인 경우
          // id: IsNull(),
        },
      // 관계를 가져오븐 법
      // join 이라고 생각하자
      // relations 속성을 사용하면 select 절이나 where 절 등 다른 곳에서 해당 속성의 컬럼을 사용 할 수 있다.
      // relations: {
      //   profile: true,
      // },
      // 정렬 순서
      // asc , desc
      order: {
        id: 'asc',
      },
      // skip 처음 몇개를 제외할질,
      // skip: 0,
      // 총 몇개를 가지고 올지 정하는 프로퍼티
      // 페이지네이션에 유용할 듯하다
      // 기본 값은 전체 결과 값이다.

      // skip 과 take의 값을 동적으로 사용하여 페이지네이션에 활용하기 좋을 것 같다
      // take: 4,
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

  @Post('sample')
  async sample() {
    // 모델에 해당되는 객체 생성 - 저장은 안함
    // const user1 = this.userRepository.create({
    //   email: 'test@google.com',
    // });

    // const user2 = await this.userRepository.save({
    //   email: 'test@mail.com',
    // });

    // preload
    // 입력된 값을 기반으로 데이터베이스에 있는 데이터를 불러오고
    // 추가 입력된 값으로 데이터베이스에서 가져온 값들을 대체함.
    // 저장하지는 않음
    // find와 create 함수가 섞인 버전 데이터를 찾을 경우 primary key 혹은 entity id 를 사용해서 만 찾을 수 있다.
    // 고로 id 가 email의 값으로 찾아서 id를 변경할 수 없다.
    // https://typeorm.delightful.studio/classes/_repository_repository_.repository.html#preload
    // const user3 = await this.userRepository.preload({
    //   id: 101,
    //   email: 'testPreload@google.com',

    // 삭제하기
    // await this.userRepository.delete(101);

    // 특정 칼럼의 값을 증가 시키는 법
    // await this.userRepository.increment(
    //   {
    //     id: 3,
    //   },
    //   'count',
    //   100,
    // );

    // 특정 칼럼의 값을 감소 시키는 법
    // await this.userRepository.decrement({ id: 1 }, 'count', 2);

    // 갯수 카운팅 (count 함수)

    // const count = await this.userRepository.count({
    //   where: {
    //     email: ILike('%0%'),
    //   },
    // });

    // sum

    // const sum = await this.userRepository.sum('count', {
    //   id: LessThan(4),
    // });

    // 평균
    // const average = await this.userRepository.average('count', {
    //   id: LessThan(4),
    // });

    // 최소값
    // const min = await this.userRepository.minimum('count', {
    //   id: LessThan(4),
    // });

    // 최대값
    // const max = await this.userRepository.maximum('count', {
    //   id: LessThan(4),
    // });

    // findOne의 경우 여러개의 값이 해당한다면 가장 첫번째의 값을 가지고 온다
    // const userOne = await this.userRepository.findOne({
    //   where: {
    //     id: MoreThan(3),
    //   },
    // });

    //pagenation
    // const userAndCount = await this.userRepository.findAndCount({
    //   take: 3,
    // });

    return true;
  }
}
