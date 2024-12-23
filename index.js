const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'views')));

app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
