import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm"

@Entity()
export class Post extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number

    @Column({unique: true})
    title!: string

    @Column()
    text!: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}