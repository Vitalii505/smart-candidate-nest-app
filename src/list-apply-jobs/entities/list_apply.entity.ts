import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  // import { UserEntity } from '../../users/entities/user.entity';
  
  @Entity('list_apply_jobs')
  export class ListApplyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    position: string;
    
    @Column()
    url: string;
  
    @Column()
    text: string;

    @Column()
    answer: string | null;

    @Column()
    srcImage: string | null;

    @Column()
    type: string | null;

    @Column()
    date: Date | null;

    @Column()
    status: string | null;
  
    // @ManyToOne(() => UserEntity, (user) => user.files)
    // user: UserEntity;
  
    // @DeleteDateColumn()
    // deletedAt?: Date;
  }