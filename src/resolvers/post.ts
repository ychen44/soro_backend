import { Post } from "../entities/Post";
import { Resolver, Query, Ctx } from "type-graphql";
import { MyContext } from "src/types";


@Resolver()

export class PostResolver {
@Query(()=> [Post]) // setting the graphql type 
posts(@Ctx() {em}: MyContext): Promise<Post[]>{ // setting the typescript type
return em.find(Post, {})

}

}