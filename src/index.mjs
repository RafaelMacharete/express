import express, { response } from "express";
import routes from './routes/index.mjs'
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";
import passport from "passport";
import './strategies/local_strategy.mjs';
const app = express();

app.use(express.json());
app.use(cookieParser('helloworld'));
app.use(
   session({
      session: 'macharete rafael',
      saveUninitialized: false, // Controls wheter a new, but unmodified, 
      // session should be saved to the session store. False: when we don't want to save unmodified session data to the session store
      resave: false,
      cookie: {
         maxAge: 60000 * 60,
      },
   })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log(`Running on Port ${PORT}`);
});

app.post('/api/auth', passport.authenticate('local'), (request, response) => {
   response.send(200);
});

app.get('/', (request, response) => {
   console.log(request.session.id);
   request.session.visited = true;
   response.cookie('hello', 'world', { maxAge: 10000, signed: true })
   response.status(200).send('<h1> Receiving cookie</h1>')
})

app.post('/api/auth', (request, response) => {
   const {
      body: { username, password }
   } = request;

   const findUser = mockUsers.find((user) => user.username === username && user.password === password);
   if (!findUser) return response.status(401).send({ msg: 'Enter valid credentials!' });

   request.session.user = findUser;

   response.status(200).send(findUser);
});

app.get('/api/auth/status', (request, response) => {
   request.sessionStore.get(request.sessionID, (err, session) => {
      console.log(session);
   })

   return request.session.user ?
      response.status(200).send(request.session.user) :
      response.status(401).send({ msg: "Not Authenticated" });
});

app.post('/api/cart', (request, response) => {
   if (!request.session.user) return response.sendStatus(401);
   const { body: item } = request;
   const { cart } = request.session;
   if (cart) { // If car is already defined, just push into.
      cart.push(item);
   } else { // If not, create it instance within session of request
      request.session.cart = [item]
   }

   return response.status(201).send(item);
});

app.get('/api/cart', (request, response) => {
   if (!request.session.user) return response.sendStatus(401);
   return response.send(request.session.cart ?? []);
})