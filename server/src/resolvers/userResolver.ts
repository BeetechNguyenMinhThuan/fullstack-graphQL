import {Arg, Mutation, Resolver} from 'type-graphql'
import {User} from "../models/User";
import argon2 from 'argon2'
import {UserMutationResponse} from "../types/UserMutationResponse";
import {RegisterInput} from "../types/RegisterInput";
import {validateRegisterInput} from "../utils/validateRegisterInput";
import {LoginInput} from "../types/LoginInput";
import {createToken} from "../utils/auth";


@Resolver()
export class UserResolver {
    @Mutation((_returns) => UserMutationResponse)
    async register(
        @Arg('registerInput') registerInput: RegisterInput,
    ): Promise<UserMutationResponse> {
        const validateInput = validateRegisterInput(registerInput)
        if (validateInput) {
            return {code: 400, success: false, ...validateInput}
        }
        try {
            const {username, email, password} = registerInput
            const existingUser = await User.findOne({
                where: [{username}, {email}]
            })
            if (existingUser) {
                return {
                    code: 400,
                    success: false,
                    message: 'Duplicate username or email address',
                    errors: [
                        {
                            field: existingUser.username === username ? 'username' : 'email',
                            message: `${existingUser.username === username ? 'username' : 'email'} already exists`
                        },

                    ]
                };
            }
            const hashedPassword = await argon2.hash(password);
            const newUser = User.create({email, username, password: hashedPassword});

            return {
                code: 200,
                success: true,
                message: 'User registration successful',
                user: await User.save(newUser)
            }
        } catch (err) {
            console.log(err.message)
            return {
                code: 500,
                success: false,
                message: `Internal server error: ${err.message}`,
            }
        }
    }


    @Mutation((_returns) => UserMutationResponse)
    async login(
        @Arg('loginInput') loginInput: LoginInput,
    ): Promise<UserMutationResponse> {
        try {
            const {usernameOrEmail, password} = loginInput
            const existingUser = await User.findOne(usernameOrEmail.includes('@') ? {where: [{email: usernameOrEmail}]} : {where: [{username: usernameOrEmail}]})
            if (!existingUser) {
                return {
                    code: 400,
                    success: false,
                    message: 'Error login',
                    errors: [
                        {
                            field: 'usernameOrEmail',
                            message: 'Username or email incorrect'
                        },
                    ]
                };
            }
            const passwordValid = await argon2.verify(existingUser.password, password)
            if (!passwordValid) {
                return {
                    code: 400,
                    success: false,
                    message: 'Wrong password',
                    errors: [
                        {
                            field: 'password',
                            message: 'Wrong password'
                        },
                    ]
                };
            }

            return {
                code: 200,
                success: true,
                message: 'User login successful',
                user: existingUser,
                accessToken: createToken(existingUser)
            }
        } catch
            (err) {
            console.log(err.message)
            return {
                code: 500,
                success: false,
                message: `Internal server error: ${err.message}`,
            }
        }
    }

}