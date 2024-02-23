// import { describe, it, test, beforeAll, beforeEach } from '@jest/globals';
import * as validator from 'express-validator';
import * as helpers from '../../utils/helpers.mjs';
import { mockUsers } from "../../utils/constants.mjs";
import { getUserByIdHandler, createUserHandler } from "../handlers/users.mjs";
import { User } from '../mongoose/schemas/user.mjs';

// SCENARO WERE WE WANT TO GET THE USER

jest.mock('express-validator', () => ({
    validationResult: jest.fn(() => ({
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{ msg: 'invalid username' }])
    })),
    matchedData: jest.fn(() => ({
        username: "test",
        password: "password",
        displayName: "test_name"
    }))
}));

jest.mock('../../utils/helpers.mjs', () => ({
    hashPassword: jest.fn((password) => `hashed_${password}`),
}));

jest.mock('../mongoose/schemas/user.mjs');

const mockRequest = {
    findUserIndex: 1
};

const mockResponse = {
    sendStatus: jest.fn(),
    send: jest.fn(),
    status: jest.fn(() => mockResponse),
};

describe('get users', () => {

    // beforeEach(() => {
    //     jest.clearAllMocks();
    // })

    it('should get user by id', () => {

        getUserByIdHandler(mockRequest, mockResponse);

        expect(mockResponse.send).toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalledWith(mockUsers[1]);
        expect(mockResponse.send).toHaveBeenCalledTimes(1);
        expect(mockResponse.sendStatus).not.toHaveBeenCalled();
    });

    it('should call sendStatus with 404 when user not found', () => {

        const copyMockRequest = { ...mockRequest, findUserIndex: 100 };

        getUserByIdHandler(copyMockRequest, mockResponse);

        expect(mockResponse.sendStatus).toHaveBeenCalled();
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
        expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);
        expect(mockResponse.send).not.toHaveBeenCalled();
    })
});

// SCENARIO WERE WE WANT TO CREATE THE USER

describe('create users', () => {

    const mockRequest = {};

    it('should return status of 400 when there are errors', async () => {
        await createUserHandler(mockRequest, mockResponse)
        expect(validator.validationResult).toHaveBeenCalled();
        expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith([{ msg: 'invalid username' }]);
    });

    it('should return status of 201 and the user created', async () => {

        jest.spyOn(validator, 'validationResult').mockImplementationOnce(() => ({
            isEmpty: jest.fn(() => true)
        }));

        // first wait to check if save has been called
        const saveMethod = jest.spyOn(User.prototype, 'save').mockResolvedValueOnce({
            id: 1,
            username: "test",
            password: "password",
            displayName: "test_name"
        });

        await createUserHandler(mockRequest, mockResponse);
        expect(validator.matchedData).toHaveBeenCalledWith(mockRequest);
        expect(helpers.hashPassword).toHaveBeenCalledWith("password");
        expect(helpers.hashPassword).toHaveReturnedWith("hashed_password");
        expect(User).toHaveBeenCalledWith({
            username: "test",
            password: "hashed_password",
            displayName: "test_name"
        });

        // still first wait to check if save has been called
        expect(saveMethod).toHaveBeenCalled();
        // second way to check if save has been called
        expect(User.mock.instances[0].save).toHaveBeenCalled();

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.send).toHaveBeenCalledWith({
            id: 1,
            username: "test",
            password: "password",
            displayName: "test_name"
        });
    });

    it('should send status of 400 when database failed to save user', async () => {

        jest.spyOn(validator, "validationResult")
        .mockImplementationOnce(() => ({
            isEmpty: jest.fn(() => true)
        }));

        const saveMethod = jest
        .spyOn(User.prototype, "save")
        .mockImplementationOnce(() => Promise.reject("Failed to save user"));

        await createUserHandler(mockRequest, mockResponse);
        expect(saveMethod).toHaveBeenCalled();
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
    })
});