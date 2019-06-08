const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const compression = require('compression')
const helmet = require('helmet');

const config = require('./config/config');
const PORT = process.env.PORT || 7000;

mongoose.Promise = global.Promise;

mongoose.connect(
  config.mongoURI,
  {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useNewUrlParser: true,
    useFindAndModify: false
  },
);

require('./models/yo');

const app = express();
app.set('trust proxy',true);
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,x-access-token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

const server = app.listen(PORT);
const io = require('socket.io').listen(server, {pingTimeout: 60000});
app.io = io

console.log("Yo server running on Port " + PORT);
console.log("\nApp logs are available at: \n" + config.logLocation);

require('./routes/yo')(app);
require('./services/cache');