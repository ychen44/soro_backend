import "dotenv/config";
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
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";

const main = async () => {
  //**************** setting up Mikro-orm *****************
  const orm = await MikroORM.init(microConfig); // connect to db
  await orm.getMigrator().up(); // runs the migration when server starts, does not run old migrations
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();

  //**************** setting up express server *****************
  const app = express();

  //**************** setting up cookies via redis  *****************
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax",
      },
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      saveUninitialized: false,
      secret: "process.env.REDIS_SECRET",
      resave: false,
    })
  );

  //**************** Setting up graphql resolvers  *****************
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  await apolloServer.start();

  //**************** create an graqphql endpoint in express *****************
  apolloServer.applyMiddleware({ app });

  //****************Express listening in 3000 *****************
  app.listen(3000, () => {
    console.log("server started on localhost:4000");
  });

  // //test
  // // // below runs sql command
  // const post = orm.em.create(Post, { title: "my first post" }); // creates an instance of post
  // // const post = new Post('my first post') //-- same as above
  // await orm.em.persistAndFlush(post); // insert the post object into the database
};
main().catch((err) => {
  console.error(err);
});
