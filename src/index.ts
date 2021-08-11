import "dotenv/config";
import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";



const main = async () => {

  const orm = await MikroORM.init(microConfig); // connect to db
  await orm.getMigrator().up(); // runs the migration
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();
  // setting up the server
  const app = express();

  // pass in graphql schema
  // add post object to schema
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(3000, () => {
    console.log("server started on localhost:4000");
  });

  //test
  // // below runs sql command
  const post = orm.em.create(Post, { title: "test post" });

  await orm.em.persistAndFlush(post); // insert the post object into the database
};
main().catch((err) => {
  console.error(err);
});
