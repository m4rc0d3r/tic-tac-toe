# Tic-tac-toe

## Table of contents

- [Introduction](#introduction)
- [About](#about)
- [Technologies used](#technologies-used)
- [Downloading](#downloading)
- [Prerequisites for assembly and launch](#prerequisites-for-assembly-and-launch)
- [Building](#building)
  - [Backend application](#backend-application)
  - [Frontend application](#frontend-application)
- [Launch of the project](#launch-of-the-project)
  - [Backend application](#backend-application)
  - [Frontend application](#frontend-application)

## Introduction

You can try this application in action by following this [link](https://m4rc0d3r.github.io/tic-tac-toe/).

## About

A primitive implementation of a tic-tac-toe game against a bot with some features that can be found in almost any web application.

Implemented functions:

- registration
- login
- editing account information:
  - personal information
  - login information
- user search
- authentication session management:
  - view active sessions
  - termination of session(s)
- everything related to the game:
  - specifying parameters for the game
  - the game itself
  - the ability to specify a time limit for the game
  - viewing game results for one gaming session

## Technologies used

The project uses the following technologies:

- on the backend and frontend

  - [zod](https://zod.dev/) — library for schema-based data validation
  - [tRPC](https://trpc.io/) — a tool for easily creating and using fully type-safe APIs without schematics or code generation

- only on the backend

  - [Node.js](https://nodejs.org/en/) — JavaScript runtime environment
  - [Fastify](https://fastify.dev/) — fast and low overhead web framework, for Node.js
  - [PostgreSQL](https://www.postgresql.org/) — relational database management system
  - [Prisma ORM](https://www.prisma.io/) — Next-Generation Node.js and TypeScript ORM
  - [Vercel Blob](https://vercel.com/docs/vercel-blob) — file storage service
  - [bcrypt](https://github.com/kelektiv/node.bcrypt.js) — password hashing library

- only on the frontend

  - [React](https://react.dev/) — the library for web and native user interfaces
  - [React Router](https://reactrouter.com/) — multi-strategy router for React
  - [React Hook Form](https://react-hook-form.com/) — a library for productive, flexible, and extensible forms with easy-to-use validation
  - [zustand](https://zustand-demo.pmnd.rs/) — a small, fast, and scalable bearbones state management solution
  - [TanStack Query](https://tanstack.com/query/latest) — powerful asynchronous state management, server-state utilities and data fetching
  - [i18next](https://www.i18next.com/) — an internationalization-framework
  - [shadcn](https://ui.shadcn.com/) — a set of beautifully designed components
  - [Tailwind CSS](https://tailwindcss.com/) — a utility-first CSS framework

## Downloading

To download the project, run the following command:

```sh
git clone https://github.com/m4rc0d3r/tic-tac-toe.git
```

## Prerequisites for assembly and launch

To build and run the project, the following programs must be installed on your computer:

- [Node.js](https://nodejs.org/en/) — JavaScript runtime environment
- [PnPM](https://pnpm.io/) — fast, disk space efficient package manager ([installation manual](https://pnpm.io/installation))

Commands to build and run the project must be executed from the project root directory.

## Building

First, you need to install the dependencies.
This can be done using the following command:

```sh
pnpm install --frozen-lockfile
```

### Backend application

Make a copy of the `apps/backend/.env.example` file, name it `apps/backend/.env` and fill it with missing values ​​(or modify existing ones).

Note: Most of the variables in the `apps/backend/.env.example` file are already set up for running the project locally.

Most likely, you only need to specify the value of the `VERCEL_BLOB_READ_WRITE_TOKEN` variable. This value can be obtained by registering a [Vercel](https://vercel.com/) account, which will allow you to create BLOB storage.

Once you have populated the `apps/backend/.env` file, run the following commands while in the root of your project:

```sh
cd packages/core
pnpm build
cd ../../apps/backend
pnpm prisma generate
pnpm prisma migrate deploy
pnpm prisma generate --sql
pnpm build
```

After this, you will have a backend application ready to launch.

### Frontend application

Make a copy of the `apps/frontend/.env.example` file, name it `apps/frontend/.env` and fill it with missing values ​​(or modify existing ones).

Note: Most of the variables in the `apps/frontend/.env.example` file are already set up for running the project locally.

Once you have populated the `apps/frontend/.env` file, run the following commands while in the root of your project:

```sh
pnpm --filter @tic-tac-toe/frontend... build
```

After this, you will have a front-end application ready to launch.

## Launch of the project

### Backend application

To run the application, run the following commands:

```sh
cd apps/backend
pnpm start:prod
```

### Frontend application

To run the application, run the following commands:

```sh
cd apps/frontend
pnpm preview
```
