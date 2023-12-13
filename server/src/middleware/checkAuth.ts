import {MiddlewareFn} from "type-graphql";
import {Context} from "../types/Context";
import {AuthenticationError} from "apollo-server-core";
import * as process from "process";
import {Secret, verify} from "jsonwebtoken";
import {UserAuthPayload} from "../types/UserAuthPayload";

export const checkAuth: MiddlewareFn<Context> = async ({context}, next) => {
    try {
        const authHeader = context.req.header('Authorization'); // Bearer accessToken
        const accessToken = authHeader && authHeader.split(' ')[1];
        if (!accessToken) {
            throw new AuthenticationError('Not authorized');
        }
        context.user = verify(accessToken, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload
        return next();
    } catch (error) {
        throw new AuthenticationError(`Error, ${JSON.stringify(error)}`)
    }
};