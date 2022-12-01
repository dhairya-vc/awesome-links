# Awesome Links

[Fullstack app with TypeScript, Next.js, Prisma & GraphQL](https://prisma.io/blog/fullstack-nextjs-graphql-prisma-oklidw1rhw)

<br/>

# Add prisma to project

Install Prisma's CLI as a development dependency:

`npm install prisma -D`

Create a basic Prisma setup by running:

`npx prisma init`

Migrating and pushing changes to the database

`npx prisma db push`

`npx prisma migrate dev --name [first-migration]`

<br/>

## Seeding the database

install Prisma Client, run the following command:

`npm install @prisma/client`

Seed your database by running the following command:

`npx prisma seed`