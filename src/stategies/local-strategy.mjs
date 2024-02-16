import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../../utils/constants.mjs";

export default passport.use(
    new Strategy((username, password, done) => {
        console.log(`Username is: ${username}`);
        console.log(`Password is: ${password}`);
        try {
            const findUser = mockUsers.find(user => user.username === username);

            if (!findUser) throw new Error("User not found");

            console.log(findUser)

            if (findUser.password !== password) throw new Error("Invalid Credentials");

            done(null, findUser);
            
        } catch (error) {
            done(error, null);
        }

    })
)