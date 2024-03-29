require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// gives server access to static files generated by running yarn build in client
app.use(express.static('./build/'));

// mount routes
app.use('/api/thoughts/', require('./server/routes/thoughts-route'));

// the asterisk is very important!! as it allows client side routing
// with react-router or w/e client side routing package you use
app.get('/*', (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/build/' });
});

const port=process.env.PORT || 3000;
app.listen(port,() => {
  console.log(`something happening at ` + port);
});

