import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from './user.entity';

@Entity()
export class ProfileModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  profileImg: string;

  @OneToOne(() => UserModel, (user) => user.profile)
  user: UserModel;
}
