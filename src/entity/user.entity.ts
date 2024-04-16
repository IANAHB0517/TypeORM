import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

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

  // 제목
  @Column()
  title: string;

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
}
