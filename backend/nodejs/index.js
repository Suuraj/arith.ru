const express = require('express');
const app = express();
const mongoose = require('mongoose');
const corsMiddleware = require('./middleware/cors.middleware');
const router = require('./router');
const secrets = require('/etc/secrets/secrets');
const port = process.env.PORT || 3499;

app.use(corsMiddleware);
app.use(express.json());
app.use('/', router);

(async () => {
  try {
    await mongoose.connect(secrets.uri);
    app.listen(port);
  } catch (err) {
    console.log(err);
  }
})();
