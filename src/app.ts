import express from 'express';
import routes from './app.route'
import fs from 'fs';
import { marked } from 'marked';

const app = express();
const port = process.env.port || 3000;

app.use('/api/v1', routes);

app.get('/', function (req, res) {
  const readme = fs.readFileSync('readme.md', 'utf-8')
  res.send(marked(readme.toString()));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});