import {Resolver, Query} from "type-graphql"; 


@Resolver()
export class HelloResolver {
    @Query(()=> String)
// schema is a single query that says hello 
    hello(){
        return "hello world"
    }


}