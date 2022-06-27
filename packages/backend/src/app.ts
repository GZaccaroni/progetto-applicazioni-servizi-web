import express from 'express';
import cors from 'cors';
import routes from "./routes/Routes";
const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.use('/',routes);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});