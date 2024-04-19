import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ProfileModel } from './profile.entity';

// 컬럼에 들어오는 값을 특정한 값으로 제한 해서 데이터의 Integrity를 유지하고자 할 때 사용한다.
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class UserModel {
  // ID
  // 테이블 안에서 각각의 row를 구분 할 수 있는 컬럼
  //@PrimaryColumn()

  // 자동으로 ID를 생성한다.
  // 값이 자동으로 1 씩 증가
  // @PrimaryGeneratedColumn()

  // 값을 자동으로 입력하되 임의의 값을 입력하여준다.
  // @PrimaryGeneratedColumn('uuid')
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  //   // 제목
  //   @Column({
  //     // 데이터베이스에서 인지하는 컬럼 타입
  //     // 자동으로 유추됨
  //     // 어노테이션 되는 컬럼의 종류에 따라 자동으로 등록 되지만 특정한 타입으로 생성하고자 할 경우에는 원하는 타입을 명시해 줄 수 있다.
  //     type: 'varchar',
  //     // 데이터 베이스에서 사용될 컬럼의 이름
  //     // 프로퍼티 이름으로 자동 유추 됨
  //     name: 'title',
  //     // 값의 길이
  //     // 입력 할 수 있는 글자의 길이가 300
  //     length: 300,
  //     // null 가능여부
  //     nullable: true,
  //     // true의 경우 처음 저장할 때만 값 지정 가능
  //     // 이후 값 변경 불가능
  //     update: true,
  //     // find()를 실행할 때 기본으로 값을 불러올지
  //     // 기본값이 true,
  //     select: false,
  //     // 기본 값
  //     // 아무것도 입력을 안했을 때 기본으로 들어가는 값
  //     default: 'default value',
  //     // 칼럼중에서 유일무이한 값이 돼야 하는 값
  //     unique: false,
  //   })
  //   title: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  // 데이터 생성일자
  // 데이터가 생성되는 날짜와 시간이 자동으로 입력됨
  @CreateDateColumn()
  createdAt: Date;

  //데이터 업데이트 일자
  // 데이터가 업데이트되는 날짜와 시간이 자동으로 입력됨
  @UpdateDateColumn()
  updatedAt: Date;

  // 데이터가 업데이트 될 때마다 1씩 증가한다.
  // 처음 생성되는 값은 1 이다.
  // save() 함수가 몇번 호출 되었는지 기록한다.
  @VersionColumn()
  version: number;

  // Gernerated 의 경우 Column 어노테이션과 함께 사용해야 한다.
  // row가 생성될 경우 자동으로 값이 입력되도록 하며 uuid 혹은 increament중에 선택 가능하다
  // 각 옵션에 따라 컬럼의 데이터 형식은 string 과 number 로 해주어야 한다.
  @Column()
  @Generated('uuid')
  additionalId: string;

  @OneToOne(() => ProfileModel, (profile) => profile.user)
  profile: ProfileModel;
}