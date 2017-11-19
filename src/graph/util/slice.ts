import {
  GraphQLType,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLFieldResolver,
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap
} from 'graphql';

/**
 * Convert a cursor into it's original offset
 */
function createCursorFromOffset(offset: number): string {
  const raw = `cursor:${offset}`;
  const cursor = Buffer.from(raw, 'utf8').toString('base64');

  return cursor;
}

/**
 * Convert an offset into a "obfuscated" cursor
 */
function createOffsetFromCursor(cursor: string): number {
  const raw = Buffer.from(cursor, 'base64').toString('utf8');
  const offset = parseInt(raw.substr(7), 0);

  if (Number.isNaN(offset)) {
    throw new Error(`Invalid cursor: ${"cursor"}`);
  }

  return offset;
}

/**
 * Convert first/after arguments into limit/offset
 */
function parseArgs(args: any): any {
  const { first, after, ...rest } = args;

  return {
    ...rest,
    limit: first,
    offset: after ? createOffsetFromCursor(after) + 1 : 0,
  };
}

type DeclareConfig<TSource, TContext> = {
  srcName: string,
  destType: GraphQLObjectType,
  description?: string,
  args?: GraphQLFieldConfigArgumentMap,
  resolve?: GraphQLFieldResolver<TSource, TContext>,
}

function defaultResolve() {
  return [];
}

/**
 * Create a pagination connection from one resource to another
 */
export default function declare<TSource, TContext>(
  {
    srcName,
    destType,
    description = '',
    args = {},
    resolve = defaultResolve,
  }: DeclareConfig<TSource, TContext>
): GraphQLFieldConfig<TSource, TContext> {

  function prefix(name): string {
    return `${srcName}${destType.name}${name}`
  }

  const PageInfo = new GraphQLObjectType({
    name: prefix('PageInfo'),
    fields: {
      hasNextPage: { type: GraphQLBoolean }
    },
  });

  const Edge = new GraphQLObjectType({
    name: prefix('Edge'),
    fields: {
      cursor: { type: GraphQLString },
      node: { type: destType },
    }
  });

  const Connection = new GraphQLObjectType({
    name: prefix('Connection'),
    description: 'A pagination connection to another resource',
    fields: {
      pageInfo: { type: PageInfo },
      edges: { type: new GraphQLList(Edge) },
    },
  });

  return {
    type: Connection,
    description: description,
    args: {
      ...args,
      first: { type: GraphQLInt },
      after: { type: GraphQLString },
    },
    resolve: async (obj, args, ctx, info) => {
      const innerArgs = parseArgs(args);
      const results = await resolve(obj, innerArgs, ctx, info);
      const hasNextPage = results.length === innerArgs.limit;

      return {
        pageInfo: { hasNextPage },
        edges: results.map((obj, i) => ({
          node: obj,
          cursor: createCursorFromOffset(i + innerArgs.offset),
        })),
      }
    },
  };
}
