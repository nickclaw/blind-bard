import { GraphQLFieldResolver } from 'graphql';

export function declareSlice(srcType: string, destType: string): string {
  const InfoType = `${srcType}${destType}PageInfo`;
  const ConnectionType = `${srcType}${destType}Connection`;
  const EdgeType = `${srcType}${destType}Edge`;

  return `
    type ${InfoType} {
      hasNextPage: Boolean!
    }

    type ${ConnectionType} {
      pageInfo: ${InfoType}!
      edges: [${EdgeType}]!
    }

    type ${EdgeType} {
      cursor: String!
      node: ${destType}
    }
  `;
}

export function applySlice(name, srcType: string, destType: string): string {
  const ConnectionType = `${srcType}${destType}Connection`;
  const Args = `first: Int! after: String`;

  return `${name}(${Args}): ${ConnectionType}`;
}

type OuterArgs = {
  first: number,
  after?: string,
};

type InnerArgs = {
  limit: number,
  offset: number,
};

function createCursorFromOffset(offset: number): string {
  const raw = `cursor:${offset}`;
  const cursor = Buffer.from(raw, 'utf8').toString('base64');

  debug('encoded %s to %s', offset, cursor);
  return cursor;
}

function createOffsetFromCursor(cursor: string): number {
  const raw = Buffer.from(cursor, 'base64').toString('utf8');
  const offset = parseInt(raw.substr(7), 0);

  if (Number.isNaN(offset)) {
    throw new Error(`Invalid cursor: ${"cursor"}`);
  }

  debug('decoded %s from %s', offset, cursor);
  return offset;
}

function parseArgs(args: OuterArgs): InnerArgs {
  return {
    limit: args.first,
    offset: args.after
      ? createOffsetFromCursor(args.after) + 1
      : 0,
  };
}

export function resolveSlice<TSource,TContext>(
  fn: GraphQLFieldResolver<TSource, TContext>
): GraphQLFieldResolver<TSource, TContext> {

  return async (obj, args: OuterArgs, ctx, info) => {
    const innerArgs = parseArgs(args);
    const results = await fn(obj, innerArgs, ctx, info);
    const hasNextPage = results.length === innerArgs.limit;

    return {
      pageInfo: { hasNextPage },
      edges: results.map((obj, i) => ({
        node: obj,
        cursor: createCursorFromOffset(i + innerArgs.offset),
      })),
    }
  };
}
