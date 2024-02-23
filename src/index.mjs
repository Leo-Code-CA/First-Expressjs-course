import express from 'express';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
// import "./stategies/local-strategy.mjs";
import "./strategies/discord_strategy.mjs";

const app = express();

// mongoose.connect("mongodb://localhost/express_tutorial")
mongoose.connect("")
.then(() => console.log('Connected to database'))
.catch((err) => console.log(err));

// ORDER MATTERS! COOKIES AND SESSION AND PASSPORT BEFORE ROUTES!
app.use(express.json());
app.use(cookieParser("secret"));
app.use(session({
    secret: 'twinkytwinky',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60
    },
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

// basic get request manage base url requests with cookie creation
app.get('/', (req, res) => {
    console.log(req.session, req.sessionID);
    req.session.visited = true;
    res.cookie("hello", "world", { maxAge: 20000, signed: true});
    res.status(200).send("Yo Girl :D");
});

app.post('/api/auth', passport.authenticate("local"), (req, res) => {
    res.sendStatus(200);
})

app.get('/api/auth/status', (req, res) => {
    console.log(`Inside /auth/status endpoint`);
    console.log(req.user);
    console.log(req.session);
    console.log(req.sessionID);
    return req.user ? res.send(req.user) : res.sendStatus(401);

})

app.post('/api/auth/logout', (req, res) => {
    if (!req.user) return res.sendStatus(401);

    req.logout((err) => {
        if (err) return res.sendStatus(400);
        res.sendStatus(200);
    })
});

// WITH OAUTH2 - DISCORD
app.get('/api/auth/discord', passport.authenticate('discord'));

app.get('/api/auth/discord/redirect', passport.authenticate('discord'), (req, res) => {
    console.log(req.session, req.user)
    res.sendStatus(200);
})













// EXAMPLES

// example of middleware function
// const loggingMiddleware = (req, res, next) => {
//     console.log(`${req.method} - ${req.url}`);
//     next();
// };

// example on how to use globally middleware functions
// app.use(loggingMiddleware, (req, res, next) => {
//     console.log('Inline middleware');
//     next();
// })

// example of a get request which manage base url requests with many inline middlewares
// app.get('/',
// (req, res, next) => {
//     console.log("BaseURL1");
//     next();
// },
// (req, res, next) => {
//     console.log("BaseURL2");
//     next();
// },
// (req, res, next) => {
//     console.log("BaseURL3");
//     next();
// },
// (req, res) => {
//     res.status(200).send("Yo Girl :D");
// })

