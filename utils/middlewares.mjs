import { mockUsers } from "./constants.mjs";

// extract logic into a middleware to reuse code
export const resolveIndexByUserId = (req, res, next) => {
    const { params: { id }} = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findUserIndex = mockUsers.findIndex(user => {
        return user.id === parsedId;
    })
    if (findUserIndex === -1) return res.sendStatus(404);
    req.findUserIndex = findUserIndex;
    next();
}