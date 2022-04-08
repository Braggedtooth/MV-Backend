# rate-app-server
Backend server for esrapp
Built with node express

## Stack

Prisma - ORM
Express

### Security

JWT 
Helmet

### Features

## Installation

- Clone the repo
```
npm install 
```
- Setup env variables
  - COOKIE_SECRET
  - JWT_EXPIRATION_MS
  - JWT_SECRET
  - DATABASE_URL
  
- Change database datasource Default is Mongodb
Depending on the datasource chosen you have access to different prisma cli commands please refer to [prisma docs](https://www.prisma.io/docs/reference/api-reference/command-reference)
- Install the prisma client
```
npm run generate  

```
- Start the server

```
npm run dev 
```
