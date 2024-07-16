# User Management System

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Server

1. Start the server in production mode:
```bash
npm run start
```

2. Start the server in development mode with hot reloading:
```bash
npm run start:dev
```

## Generating Fake Users

1. Generate fake users as JSON, then SQL:
```bash
node src/utils/user.generator.js
```

2. Run to insert the generated users into the SQL:
```bash
node src/utils/generateSQL.js
```

3. In the terminal where the PostgreSQL service is running, execute below comand to import generated SQL data into our user_management database:
```bash
psql -U chandraprakashpal -d user_management -f insertUsers.sql
```

Note: If you encounter any duplicate username errors, remove the conflicting user from file insertUsers.sql and rerun the script.

## API Documentation

The API documentation is available at:
https://documenter.getpostman.com/view/4972638/2sA3kRHiCP

Please note that the user update and delete endpoints do not use the userId from the JWT authentication, as it is assumed that an admin can also delete other users.
