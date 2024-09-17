import express from 'express';
import routes from './app.route'

const app = express();
const port = process.env.port || 3000;

app.use('/api/v1', routes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});