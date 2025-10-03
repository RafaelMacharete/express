import { Router } from "express";
import {
    query,
    validationResult,
    checkSchema,
    matchedData
} from "express-validator";
import { mockUsers } from '../utils/constants.mjs';
import { createUserValidationSchema } from "../utils/validation_schemas.mjs";
import { resolveIndexByUserId } from '../utils/middlewares.mjs'

const router = Router();

router.get(
    '/api/users',
    query('filter')
        .isString()
        .notEmpty()
        .withMessage('Must not be empty')
        .isLength({ min: 3, max: 15 })
        .withMessage('Must be at least 3 - 10 characters'),
    (request, response) => {
        const result = validationResult(request);
        const { query: { filter, value },
        } = request;

        if (filter && value) return response.send(
            mockUsers.filter((user) => user[filter].includes(value))
        );

        return response.send(mockUsers);
    }
);

router.get('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { findUserIndex } = request;
    const findUser = mockUsers[findUserIndex];
    if (!findUser) return response.sendStatus(404);
    return response.send(findUser);
});

router.post(
    '/api/users',
    checkSchema(createUserValidationSchema),
    (request, response) => {
        const result = validationResult(request);
        if (!result.isEmpty()) {
            return response.status(400).send({ errors: result.array() });
        }
        const data = matchedData(request);

        const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
        mockUsers.push(newUser);
        return response.status(201).send(newUser);
    }
);

router.put('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return response.status(200).send(mockUsers);
});

router.patch('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request;

    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body }
    return response.status(200).send(mockUsers)
});

router.delete('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { findUserIndex } = request;
    mockUsers.splice(findUserIndex, 1);
    return response.send(mockUsers);
});


export default router;