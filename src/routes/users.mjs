import { Router } from "express";
import { createUserValidationSchema, checkQueryParamsSchema } from './../../utils/validationSchemas.mjs';
import { query, checkSchema, validationResult, matchedData } from "express-validator";
import { mockUsers } from "../../utils/constants.mjs";
import { resolveIndexByUserId } from "../../utils/middlewares.mjs";

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
})

export default router;