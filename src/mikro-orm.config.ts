import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from 'path';

export default {
  migration: {
    path: path.join(__dirname,"./migrations"), 
    pattern: /^[\w-]+\d+\.[tj]s$/, 
  },
  entities: [Post], 
  // host: "process.env.DB_HOST",
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  dbName: process.env.DB_NAME,
  password:process.env.DB_PASSWORD,
  debug: !__prod__, 
  type: process.env.DB_TYPE,
} as Parameters<typeof MikroORM.init>[0];


