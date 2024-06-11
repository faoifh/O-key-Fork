import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ schema: "okey", name: "user" })
export class UserEntity {
    @PrimaryGeneratedColumn()
    count: number

    @Column()
    id: string

    @Column()
    password: string

    @Column()
    name: string

    @Column()
    interests: string

    @Column()
    refresh_token: string
}