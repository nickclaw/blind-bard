import {
  GraphQLType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLList,
} from 'graphql';

export const bool = GraphQLBoolean;

export const int = GraphQLInt;

export const float = GraphQLFloat;

export const string = GraphQLString;

export const requiredBool = new GraphQLNonNull(GraphQLBoolean);

export const requiredInt = new GraphQLNonNull(GraphQLInt);

export const requiredFloat = new GraphQLNonNull(GraphQLFloat);

export const requiredString = new GraphQLNonNull(GraphQLString);

export function object(arg) {
  return new GraphQLNonNull(new GraphQLObjectType(arg));
}

export function array(arg) {
  return new GraphQLNonNull(new GraphQLList(arg));
}
