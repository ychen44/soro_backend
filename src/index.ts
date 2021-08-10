import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import * as dotenv from "dotenv";

dotenv.config();

const main = async () => {
  // setting up mikro-orm
  // graphql need to access orm object in resolver
  const orm = await MikroORM.init(microConfig); // connect to db
  await orm.getMigrator().up(); // runs the migration

  // setting up the server
  const app = express();

  // pass in graphql schema
  // add post object to schema
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    // special object,its accessiable by all your resolvers
    // a fucntion that returns an object for the context
    context: () => ({ em: orm.em }),
  });

  await apolloServer.start();
  // create an graqphql endpoint on express
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });

  // // below runs sql command
  // const post = orm.em.create(Post, { title: "my fitst post" }); // creates an instance of post
  // // const post = new Post('my first post') -- same as above
  // await orm.em.persistAndFlush(post); // insert the post object into the database
};
main().catch((err) => {
  console.error(err);
});
