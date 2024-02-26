import mongoose from 'mongoose';
import { createApp } from './createApp.mjs';


mongoose
    .connect("mongodb://127.0.0.1:27017/express_tutorial_test")
    .then(() => console.log('Connected to database'))
    .catch((err) => console.log(err));

const app = createApp();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});












// EXAMPLES

// basic get request manage base url requests with cookie creation
// app.get('/', (req, res) => {
//     console.log(req.session, req.sessionID);
//     req.session.visited = true;
//     res.cookie("hello", "world", { maxAge: 20000, signed: true});
//     res.status(200).send("Yo Girl :D");
// });

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

