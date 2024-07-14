import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
  } from 'typeorm';
  
  @Entity({name: 'users'})
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @Column()
    surname: string;
  
    @Column({ unique: true })
    username: string;

    @Column()
    birthdate: string;
  }