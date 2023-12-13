import * as process from "process";
import 'reflect-metadata'
import express, {Application, Express} from 'express'
import {DataSource} from 'typeorm'
import {User} from "./models/User";
import {ApolloServer} from 'apollo-server-express'
import {buildSchema} from "type-graphql";
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core'
import {Post} from "./models/Post";
import {UserResolver} from "./resolvers/userResolver";

require('dotenv').config();

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
const app = express()

AppDataSource.initialize()
    .then(async () => {
        // here you can start to work with your database
        console.log("Data Source has been initialized!");

        const apolloServer = new ApolloServer({
            schema: await buildSchema({resolvers: [UserResolver], validate: false}),
            plugins: [ApolloServerPluginLandingPageGraphQLPlayground()] // Khoi tao GUI cho graphQL
        });
        await apolloServer.start();
        apolloServer.applyMiddleware({app, cors: false})
        const PORT = process.env.PORT || 4000
        app.listen(PORT, () => console.log(`Server started on port ${PORT}. GraphQL server started on localhost:${PORT}${apolloServer.graphqlPath}`))
    })

    .catch((error) => console.log(error))


