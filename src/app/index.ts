import * as express from 'express';
import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import graph from '../graph';

const app = express();

app.use(bodyParser.json())

app.use('/query', graphqlExpress({
  schema: graph,
}));

app.get('/visualize', graphiqlExpress({
  endpointURL: '/query',
}));

export default app;
