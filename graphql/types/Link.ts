import { objectType, extendType, intArg, stringArg, nonNull } from "nexus";
import { User } from "./User";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.string("id");
    t.string("title");
    t.string("url");
    t.string("description");
    t.string("imageUrl");
    t.string("category");
    t.list.field("users", {
      type: User,
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.link
          .findUnique({
            where: {
              id: _parent.id,
            },
          })
          .users();
      },
    });
  },
});

export const LinksQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("links", {
      type: Response,
      args: {
        first: intArg(),
        after: stringArg(),
      },
      async resolve(_, args, ctx) {
        let queryResults = null;

        if (args.after) {
          queryResults = await ctx.prisma.link.findMany({
            take: args.first,
            skip: 1,
            cursor: {
              id: args.after,
            },
            orderBy: {
              title: "asc",
            },
          });
        } else {
          queryResults = await ctx.prisma.link.findMany({
            take: args.first,
            orderBy: {
              title: "asc",
            },
          });
        }

        if (queryResults.length > 0) {
          const endCursor = queryResults[queryResults.length - 1].id;

          const nextResults = await ctx.prisma.link.findMany({
            take: args.first,
            cursor: {
              id: endCursor,
            },
            orderBy: {
              title: "asc",
            },
          });

          return {
            pageInfo: {
              endCursor,
              hasNextPage: nextResults.length >= args.first,
            },
            edges: queryResults.map((link) => {
              return {
                cursor: link.id,
                node: link,
              };
            }),
          };
        }

        return {
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
          },
          edges: [],
        };
      },
    });
  },
});

const PageInfo = objectType({
  name: "PageInfo",
  definition(t) {
    t.string("endCursor");
    t.boolean("hasNextPage");
  },
});

const Edge = objectType({
  name: "Edge",
  definition(t) {
    t.string("cursor");
    t.field("node", {
      type: Link,
    });
  },
});

const Response = objectType({
  name: "Response",
  definition(t) {
    t.field("pageInfo", {
      type: PageInfo,
    });
    t.list.field("edges", {
      type: Edge,
    });
  },
});

export const CreateLinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createLink", {
      type: Link,
      args: {
        title: nonNull(stringArg()),
        url: nonNull(stringArg()),
        imageUrl: nonNull(stringArg()),
        category: nonNull(stringArg()),
        description: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx) {
        if (!ctx.user) {
          throw new Error(`You need to be logged in to perform an action`);
        }
        if (ctx.user?.role !== "ADMIN") {
          throw new Error(`You do not have permission to perform action`);
        }

        const newLink = {
          title: args.title,
          url: args.url,
          imageUrl: args.imageUrl,
          category: args.category,
          description: args.description,
        };

        return await ctx.prisma.link.create({
          data: newLink,
        });
      },
    });
  },
});
