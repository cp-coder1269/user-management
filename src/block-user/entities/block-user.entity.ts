import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'block_users'})
export class BlockUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    blockId: number;
}
