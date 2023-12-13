import { Query, Resolver, UseMiddleware} from "type-graphql";
import {checkAuth} from "../middleware/checkAuth";

@Resolver()
export class HelloResolver {
    @Query()
    @UseMiddleware(checkAuth)
    hello(): string {
        return 'hello'
    }
}
