# webapp
Repository for the course CSYE-6225
<table>
    <thead>
      <tr>
        <th>Name</th>
        <th>NUID</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Arjun Raja Yogidas</td>
        <td>002964082</td>
      </tr>
    </tbody>
</table>


## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# Installation Requirements

For development, you will need Node.js and a node global package, npm, installed in your environement.

You will also need to have postgres running in your local machine
 - use cli tools like brew to install postgres
 - create a database `webapp_db` add your credentials in the `.env` file 
 - make sure that the postgres process is running in the background and specify the correct port name in your `.env` file. (default is 5432)
 - Create a datbase using `CREATE DATABASE webapp_db`
 - Create a `.env` file and add the contents from `.env_local` file and change the env values to your local database variable

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v16.14.3

    $ npm --version
    8.3.0

## Install

    $ git clone https://github.com/
    $ cd webapp
    $ npm install

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```

## API Endpoints

```
/healthz [GET] - get the health status of the webapp
v1/account [POST] - create a new user
v1/acount/:id [GET] - fetch authenticated User
v1/account/:id [PUT] - update authenticated user
```

