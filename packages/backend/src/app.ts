import express from 'express';
import session from 'express-session';
import passport from 'passport';
import User from "./model/db_schema/UserSchema";
import cors from 'cors';
import routes from "./routes/Routes";
import mongoose from "mongoose";

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());
app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{Pusadnstrc;#',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/',routes);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

// connect to database
mongoose.connect('mongodb+srv://admin:C0W6J0tA3jl8X4Cb@maincolturecloud.fujik.mongodb.net/main').then(()=>{
  console.log("Db connected");
});