import { Router } from "express";
import { createUserValidationSchema, checkQueryParamsSchema } from './../../utils/validationSchemas.mjs';
import { query, checkSchema, validationResult, matchedData } from "express-validator";
import { mockUsers } from "../../utils/constants.mjs";
import { resolveIndexByUserId } from "../../utils/middlewares.mjs";
import { User } from '../mongoose/schemas/user.mjs';
import { hashPassword } from "../../utils/helpers.mjs";

const router = Router();

// HANDLE ROUTES WITH QUERY PARAMETERS

// Handle get request - with query validation
router.get('/api/users', 
// INLINE - WITHOUT SCHEMA 
// query('filter')
// .isString()
// .notEmpty()
// .withMessage("Must not be empty")
// .isLength({ min: 3, max: 10})
// .withMessage('Must be between 3 and 10 characters'),
// // WITH SCHEMA
checkSchema(checkQueryParamsSchema),
(req, res) => {
// console.log(req.query)
// console.log(req['express-validator#contexts'])

console.log(req.session, req.sessionID);
req.sessionStore.get(req.sessionID, (err, sessionData) => {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log(sessionData)
})


const result = validationResult(req);
// console.log(result);
if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() })
}

const data = matchedData(req);
// console.log(data);

const { query: { value} } = req;
const { filter } = data;

if (filter && value) {
    return res.send(mockUsers.filter(user => {
        return user[filter].includes(value);
    }))
}

return res.send(mockUsers);
});

// HANDLE USERS ROUTE WITH UNKNOWN PARAMETERS

// handle post request - with body validation
router.post('/api/users',
// INLINE - WITHOUT SCHEMA 
// [
//     body('username')
//         .notEmpty()
//         .withMessage("Username cannot be empty")
//         .isLength({min: 5, max: 32})
//         .withMessage("Username must contain between 5 and 32 characters")
//         .isString()
//         .withMessage("Must be a string!"),
//     body('displayName').notEmpty()
// ],
// WITH SCHEMA
checkSchema(createUserValidationSchema),
(req, res) => {
// console.log(req.body);
// console.log(result);
const result = validationResult(req);

if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() });
}

const data = matchedData(req);
console.log(data);

const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
mockUsers.push(newUser)
// console.log(mockUsers)
return res.status(201).send(newUser);
});

// handle get request with external middleware
router.get('/api/users/:id', resolveIndexByUserId, (req, res) => {

    const { findUserIndex } = req;

    const findUser = mockUsers[findUserIndex];

    if (!findUser) {
        return res.sendStatus(404);
    }
    return res.send(findUser);
});


// handle put request
router.put('/api/users/:id', resolveIndexByUserId, (req, res) => {

    const { body, findUserIndex } = req;

    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body }

    return res.sendStatus(200);

});

// handle patch request
router.patch('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;

    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body};

    return res.sendStatus(200);
})

// handle delete request
router.delete('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;

    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
});

// POST AND GET REQUEST FOR USERS SESSIONS

// router.post('/api/auth', (req, res) => {

//     const { body: { username, password } } = req;

//     const findUser = mockUsers.find(user => user.username === username);

//     if (!findUser || findUser.password !== password) return res.status(401).send({ msg: 'BAD CREDENTIALS'});

//     req.session.user = findUser;

//     return res.status(200).send(findUser);

// });

// router.get('/api/auth/status', (req, res) => {

//     // console.log(req.session)
    
//     req.sessionStore.get(req.sessionID, (err, session) => {
//         console.log(session)
//     });
    
//     return req.session.user ? res.status(200).send(req.session.user) : res.status(401).send({ msg: "Not Authenticated"});
// })

// DATABASE USERS
router.post(
    "/api/dbusers",
    checkSchema(createUserValidationSchema),
    async (req, res) => {

    const result = validationResult(req);

    if (!result.isEmpty()) return res.status(400).send(result.array());

    const data = matchedData(req);

    data.password = hashPassword(data.password);
    console.log(data);

    const newUser = new User(data);
    console.log(data);

    try {
        const savedUser = await newUser.save();
        return res.status(201).send(savedUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});

export default router;