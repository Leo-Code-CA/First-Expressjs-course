import express from 'express';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import "./stategies/local-strategy.mjs";

const app = express();

// ORDER MATTERS! COOKIES AND SESSION AND PASSPORT BEFORE ROUTES!
app.use(express.json());
app.use(cookieParser("secret"));
app.use(session({
    secret: 'twinkytwinky',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60
    }
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

