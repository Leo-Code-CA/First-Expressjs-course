import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../../utils/constants.mjs";
import { User } from '../mongoose/schemas/user.mjs';
import { comparePassword } from "../../utils/helpers.mjs";

// EXAMPLE WITHOUT DB
// passport.serializeUser((user, done) => {
//     console.log(`Inside Serialize User`);
//     console.log(user);
//     done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     console.log(`Inside Deserializer`);
//     console.log(`Deserializing User ID ${id}`);
//     try {
//         const findUser = mockUsers.find(user => user.id === id);
//         if (!findUser) throw new Error("User Not Found");
//         done(null, findUser);
//     } catch (error) {
//         done(error, null);
//     }
// })

// export default passport.use(
//     new Strategy(
//         (username, password, done) => {
//         console.log(`Username is: ${username}`);
//         console.log(`Password is: ${password}`);
//         try {
//             const findUser = mockUsers.find(user => user.username === username);

//             if (!findUser) throw new Error("User not found");

//             // console.log(findUser)

//             if (findUser.password !== password) throw new Error("Invalid Credentials");

//             done(null, findUser);
            
//         } catch (error) {
//             done(error, null);
//         }

//     })
// )

// EXAMPLE WITH DB

passport.serializeUser((user, done) => {
    console.log(`Inside Serialize User`);
    console.log(user);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log(`Inside Deserializer`);
    console.log(`Deserializing User ID ${id}`);
    try {
        const findUser = await User.findById(id);
        if (!findUser) throw new Error("User Not Found");
        done(null, findUser);
    } catch (error) {
        done(error, null);
    }
})

export default passport.use(
    new Strategy(
        async (username, password, done) => {

        try {
            const findUser = await User.findOne({ username: username });
            if (!findUser) throw new Error("User not found!");
            if (!comparePassword(password, findUser.password)) throw new Error("Bad Credentials!");
            done(null, findUser);
        } catch (error) {
            done(error, null);
        }

    })
)