// .ENV LIBRARY:
require('dotenv').config();
// PULLING EXPRESS LIBRARY:
const express = require('express');
// APP VARIABLE TO CONFIGURE SERVER:
const app = express();
// MONGOOSE CONFIGURE:
const mongoose = require('mongoose');
// CONNECT WITH DATABASE:
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db = mongoose.connection;
// ERROR:
db.on('error', (error) => console.error(error));
// ONCE:
db.once('open', () => console.log('Connected to database'));
// SETTING UP THE SERVER:
app.listen(3000, () => console.log('Server has started'));

// SETUP SERVER TO ACCEPT JSON:
app.use(express.json());
// SETUP ROUTES:
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);