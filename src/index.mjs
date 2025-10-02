/*
   Middleware means a middle process between one or two or many
   different functions or toher processess
*/

import express from "express";

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

app.get('/api/users', (request, response) => {
   const { query: { filter, value },
   } = request;

   if (filter && value) return response.send(
      mockUsers.filter((user) => user[filter].includes(value))
   );

   return response.send(mockUsers);
})

app.get('/api/users/:id', (request, response) => {
   const parsedId = parseInt(request.params.id)

   if (isNaN(parsedId)) return response.status(400).send({
      msg: "Bad Request. Invalid Id."
   });

   const findUser = mockUsers.find((user) => user.id === parsedId)
   if (!findUser) return response.sendStatus(404);
   return response.send(findUser);
});

app.post('/api/users', (request, response) => {
   const { body } = request;
   const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
   mockUsers.push(newUser);
   return response.status(201).send(newUser);
});

app.get('/api/products', (request, response) => {
   response.status(200).send([
      { id: 1, name: 'Product 1', description: 'Description of product 1' },
      { id: 2, name: 'Product 2', description: 'Description of product 2' }
   ])
})

app.put('/api/users/:id', resolveIndexByUserId, (request, response) => {
   const { body, findUserIndex } = request;
   mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
   return response.status(200).send(mockUsers);
});

app.patch('/api/users/:id', (request, response) => {
   const { body, params: { id } } = request;

   const parsedId = parseInt(id);
   if (isNaN(parsedId)) return response.status(400).send({
      msg: "Bad request. Invalid Id."
   });

   const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

   if (findUserIndex === -1) return response.sendStatus(404);

   mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body }
   return response.status(200).send(mockUsers)
});

app.delete('/api/users/:id', (request, response) => {
   const { params: { id }, } = request;

   const parsedId = parseInt(id);
   if (isNaN(parsedId)) return response.sendStatus(400);

   const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
   if (findUserIndex === -1) return response.sendStatus(404);

   mockUsers.splice(findUserIndex, 1);
   return response.send(mockUsers);

})

app.listen(PORT, () => {
   console.log(`Running on Port ${PORT}`);
}); 
