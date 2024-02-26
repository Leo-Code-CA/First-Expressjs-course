import request from "supertest";
import { createApp } from "../createApp.mjs";
import mongoose from "mongoose";

describe('create user and login', () => {

    let app;

    beforeAll(() => {

        mongoose
            .connect("mongodb://127.0.0.1:27017/express_tutorial_test")
            .then(() => console.log('Connected to Test database'))
            .catch((err) => console.log(err));

            app = createApp();

    });

    it('should create the user', async () => {
        const response = await request(app).post('/api/dbusers').send({
            username: "username",
            password: "password",
            displayName: "Display Name"
    });

        expect(response.statusCode).toBe(201);
    });

    it('should log the user in and should visit /api/auth/status and return authenticated user', async () => {
        const response = await request(app)
            .post('/api/auth')
            .send({
                username: "username",
                password: "password"
            })
            .then((res) => {
                console.log(res.headers)
                return request(app)
                    .get('/api/auth/status')
                    .set('Cookie', res.headers['set-cookie'])
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.username).toBe('username');
        expect(response.body.displayName).toBe('Display Name');
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
});