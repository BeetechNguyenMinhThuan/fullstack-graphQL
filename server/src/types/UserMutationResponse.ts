import {Field, ObjectType} from "type-graphql";
import {IMutationResponse} from "./MutationResponse";
import {User} from "../models/User";
import {FieldError} from "./FieldError";

@ObjectType({implements: IMutationResponse})
export class UserMutationResponse implements IMutationResponse {
    code: number
    success: boolean
    message?: string

    @Field({nullable: true})
    user?: User

    @Field({nullable: true})
    accessToken?: string

    @Field(_type => [FieldError], {nullable: true}) // day la dang cua graphQL
    errors?: FieldError[] // Day la dang ts
}