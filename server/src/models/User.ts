import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm"
import {Field, ID, ObjectType} from "type-graphql";

// De model co the lam viec can ket noi model voi typeorm va typegraphQL

// Field: muon tra ve gi thi

@ObjectType() // Dong` nay de co the lien ket voi typescript voi graphQL
@Entity() // DB table cua typeorm
export class User extends BaseEntity{
    @Field(_type => ID)
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column({unique: true})
    username!: string

    @Field()
    @Column({unique: true})
    email!: string

    @Column()
    password!: string

    @Field()
    @CreateDateColumn()
    created_at: Date

    @Field()
    @UpdateDateColumn()
    updated_at: Date
}