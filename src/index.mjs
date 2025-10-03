/*
   Middleware means a middle process between one or two or many
   different functions or toher processess
*/
import express from "express";
import routes from './routes/index.mjs'

const app = express();

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log(`Running on Port ${PORT}`);
});

app.get('/', (request, response) => {
   response.cookie('hello', 'world', { maxAge: 60000 * 60 })
   response.status(200).send('<h1> Receiving cookie</h1>')
}) 