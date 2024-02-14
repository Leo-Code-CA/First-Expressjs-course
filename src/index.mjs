import express from 'express';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';

const app = express();

// ORDER MATTERS! COOKIES BEFORE ROUTES!
app.use(express.json());
app.use(cookieParser("secret"));
app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

// basic get request manage base url requests with cookie creation
app.get('/', (req, res) => {
    res.cookie("hello", "world", { maxAge: 20000, signed: true});
    res.status(200).send("Yo Girl :D");
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

