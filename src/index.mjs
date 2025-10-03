/*
   Middleware means a middle process between one or two or many
   different functions or toher processess
*/

import express from "express";
import { query, validationResult, body, matchedData } from "express-validator";


const app = express();

app.use(express.json())

// Custom middleware
const loggingMiddleware = (request, response, next) => {
   console.log(`${request.method} - ${request.url}`);
   next();
}

app.use(loggingMiddleware);

const resolveIndexByUserId = (request, response, next) => {
   const { params: { id } } = request;

   const parsedId = parseInt(id);
   if (isNaN(parsedId)) return response.status(400).send({
      msg: "Bad request. Invalid Id."
   });

   const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

   if (findUserIndex === -1) return response.sendStatus(404);

   request.findUserIndex = findUserIndex;
   next();
}

const PORT = process.env.PORT || 3000;

const mockUsers = [
   { id: 1, username: 'Rafael', displayName: 'Macharete' },
   { id: 2, username: 'henry', displayName: 'Henry' },
   { id: 3, username: 'steve', displayName: 'Steve' },
   { id: 4, username: 'robin', displayName: 'Robin' },
   { id: 5, username: 'ana', displayName: 'Ana' },
   { id: 6, username: 'christine', displayName: 'Christine' },
   { id: 7, username: 'ada', displayName: 'Ada' },
   { id: 8, username: 'ada', displayName: 'Lovelace' },
]

app.get('/', loggingMiddleware, (request, response) => {
   response.status(200).send('<h1> Everything is working!!</h1>')
})

app.get( 
   '/api/users', 
   query('filter')
   .isString()
   .notEmpty()
   .withMessage('Must not be empty')
   .isLength({ min: 3, max: 15})
   .withMessage('Must be at least 3 - 10 characters'), 
   (request, response) => {
   const result = validationResult(request);
   console.log(result);
   const { query: { filter, value },
   } = request;

   if (filter && value) return response.send(
      mockUsers.filter((user) => user[filter].includes(value))
   );

   return response.send(mockUsers);
})

app.get('/api/users/:id', resolveIndexByUserId, (request, response) => {
   const { findUserIndex } = request;
   const findUser = mockUsers[findUserIndex];
   if (!findUser) return response.sendStatus(404);
   return response.send(findUser);
});

app.post(
   '/api/users', 
   [body('username')
      .notEmpty()
      .withMessage('Username cannot be empty')
      .isLength({ min: 3, max: 30})
      .withMessage('Username must be at least 3 - 30 characters')
      .isString()
      .withMessage('Username must be a string!'),
   body('displayName')
      .notEmpty()
      .withMessage('displayName cannot be empty')
],
      (request, response) => {
   const result = validationResult(request);
   if (!result.isEmpty()){
      return response.status(400).send({errors: result.array()});
   }
   const data = matchedData(request);

   const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
   mockUsers.push(newUser);
   return response.status(201).send(newUser);
});

app.put('/api/users/:id', resolveIndexByUserId, (request, response) => {
   const { body, findUserIndex } = request;
   mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
   return response.status(200).send(mockUsers);
});

app.patch('/api/users/:id', resolveIndexByUserId, (request, response) => {
   const { body, findUserIndex } = request;

   mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body }
   return response.status(200).send(mockUsers)
});

app.delete('/api/users/:id', resolveIndexByUserId, (request, response) => {
   const { findUserIndex } = request;
   mockUsers.splice(findUserIndex, 1);
   return response.send(mockUsers);

})

app.listen(PORT, () => {
   console.log(`Running on Port ${PORT}`);
}); 