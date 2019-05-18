<h1 align="center">
  Yo - The URL Shortener
</h1>

Yo Dawg, heard you're tired of remembering URLs

<img src="images/architecture.png" alt="architecture" />

## Dependencies

- ### Server

  - [Express](https://expressjs.com/)- Node.js Framework for Building REST APIs
  - [MongoDB](http://mongodb.com/)- Document Oriented NoSQL Database
  - [Mongoose](https://http://mongoosejs.com)- MongoDB Object Modeling
  - [Valid-url](https://github.com/ogt/valid-url)- URL Validation Functions
  - [Nginx](https://www.nginx.com)- Reverse Proxy
  - [Redis](https://redis.io/)- Caching

- ### Client

  - [React](https://reactjs.org/) - JS Library for Building UI's
  - [React-router](https://github.com/ReactTraining/react-router)- Complete Routing Library for React
  - [Materialize css](http://materializecss.com/)- Responsive Front-end Framework Based on Material UI

## Getting Started

#### Prerequisites

The following will need to be installed before proceeding:

- Node v8+
- Mongo DB
- Redis Server
- Nginx

#### Clone the Project

```sh
# Clone it
git clone https://github.com/jonfairbanks/yo.git
cd yo
```

#### Run Backend

```
# Move to server Folder
cd server/

# Install Dependencies
yarn install

# Start Server
yarn start
```

#### Run Front End

```
# Move to client Folder
cd client/

# Install Dependencies
yarn install

# Start Client
yarn start
```

#### Configure Nginx

Client:
```
location /manifest.json {
    proxy_pass http://127.0.0.1:3000/manifest.json;
}
location / {
    proxy_pass http://127.0.0.1:3000/;
    proxy_set_header X-Real-IP $remote_addr;
    # Upgrade for Websockets
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

Server:
```
location ~* "^/[0-9a-z!?@_-]{1,99}$"  {
    proxy_set_header X-Real-IP $remote_addr;
    rewrite ^/(.*)$ https://my-api-url.com/api/item/$1 redirect;
}
location / {
    proxy_pass http://127.0.0.1:7000;
    proxy_set_header X-Real-IP $remote_addr;
    # Upgrade for Websockets
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

## ☑ TODO

- [x] Auto Update Tab Data
- [x] Client Dockerfile
- [ ] Server Dockerfile
- [ ] Re-think the caching setup
- [ ] Better Error Handling when Navigating to Unset Names
- [ ] Pass through for Query Parameters
- [ ] Swipeable Tabs
- [ ] Edit/Delete Functionality

## Contributers
Jon Fairbanks - Maintainer
