import {sign, Secret} from 'jsonwebtoken'
import {User} from "../models/User";
import * as process from "process";

export const createToken = (user: User) => {
    return sign({userId: user.id}, process.env.ACCESS_TOKEN_SECRET as Secret,
        {expiresIn: '15m'})
}