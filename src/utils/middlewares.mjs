/*
   Middleware means a middle process between one or two or many
   different functions or toher processess
*/
import { mockUsers } from "./constants.mjs";

// Custom middleware
export const loggingMiddleware = (request, response, next) => {
   console.log(`${request.method} - ${request.url}`);
   next();
}


export const resolveIndexByUserId = (request, response, next) => {
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