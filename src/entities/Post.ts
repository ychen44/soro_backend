import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType, Int } from "type-graphql";

//https://mikro-orm.io/docs/defining-entities/
// 4 coulms in the db table is whats being created here

// convert it into graphql type added @ObjectType & @Field. Field is letting it expose to graphql schema 
@ObjectType()
@Entity() // declaritive, tells mikrorm is an entity. corresponse to a database table
export class Post {

  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" }) // decrative, database colum. if it's remove it will just be a field in the class
  createdAt = new Date();

  @Field(()=> String)
  @Property({ type: "date", onUpdate: () => new Date() }) // onupdate is a hook thats going to create a date everytime we updates
  updatedAt = new Date();

  @Field()
  @Property({ type: "text" })
  title!: string;
}
