const express = require('express');
require('dotenv').config();
const app = express();
const postsRoutes = require('./routes/postsRoutes');
const path = require('path');
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const jobRoutes = require("./routes/jobs");
app.use("/api/jobs", jobRoutes);
const uploadRoutes = require('./routes/uploadRoutes');
const basicAuth = require('./routes/basicAuth.js');
require('dotenv').config();
app.set('trust proxy', 1); // or true

app.use(cors());


app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/posts',postsRoutes)
app.use('/auth', basicAuth);
app.use('/assets', uploadRoutes);
app.use('/jobs', require('./routes/jobsRoutes'));
app.use('/connections', require('./routes/connectionsRoutes'));

app.listen(4000, () => {
    console.log('Server started on port 4000');
});
