const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;
// Middleware
app.use(cors());
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
function connect_to_db() {
    // Connect to MongoDB
    let uri = process.env.ATLAS_URI;
    if (process.env.NODE_ENV === "test") {
        uri = process.env.Testing_URI;
    }
    console.log(uri)
    mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log("MongoDB database is connected successfully");
    })

    // Direct route http://localhost:4000/auth
    const coursesRouter = require('./routes/courses');
    app.use('/courses', coursesRouter);
    const authRouter = require('./routes/auth');
    app.use('/api/auth', authRouter);
    const commentsRouter = require('./routes/comments');
    app.use('/comments', commentsRouter);
    const professorRouter = require('./routes/professors');
    app.use('/professors', professorRouter);
    const userRouter = require('./routes/user');
    app.use('/userprofile', userRouter);
    const searchRouter = require('./routes/search')
    app.use('/search', searchRouter);
    var materialRouter = require('./routes/materials');
    app.use('/material', materialRouter);

    // Passport middleware
    app.use(passport.initialize());
    // Passport config
    require("./passport")(passport);

    try {
        https.createServer({
            key: fs.readFileSync('server.key'),
            cert: fs.readFileSync('server.cert')
        }, app)
            .listen(port, function () {
                console.log(`Server is running on port: ${port}`)
            })
    } catch (error) {
        console.log("https files not found, using http server")
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });
    }
}

connect_to_db();
module.exports = app; // for testing