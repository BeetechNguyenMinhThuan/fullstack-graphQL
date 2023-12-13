import * as process from "process";
import 'reflect-metadata'
import express from 'express'
import {DataSource} from 'typeorm'
import {User} from "./models/User";
import {ApolloServer} from 'apollo-server-express'
import {buildSchema} from "type-graphql";
import {ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core'
import {Post} from "./models/Post";
import {UserResolver} from "./resolvers/userResolver";
import {HelloResolver} from "./resolvers/helloResolver";

require('dotenv').config();

const app: any = express()
const PORT = process.env.PORT || 4000
const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    database: "fullstack-graphql",
    entities: [User, Post],
    synchronize: true,
    logging: false,
})
AppDataSource.initialize().catch((error) => console.log(error))


const initApolloServer = async () => {
    const apolloServer = new ApolloServer({
        schema: await buildSchema({resolvers: [HelloResolver, UserResolver], validate: false}),
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground(),
            ApolloServerPluginDrainHttpServer({httpServer: app})
        ],
        context: ({req, res}) => ({req, res})
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({app, cors: false})
    app.listen(PORT, () => console.log(`Server started on port ${PORT}. GraphQL server started on localhost:${PORT}${apolloServer.graphqlPath}`))
}
initApolloServer();


