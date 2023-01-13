import Koa from 'koa';
import cors from '@koa/cors';
import koaBody from 'koa-body';
import morgan from 'morgan';
import { logger, stream } from './logger.js';
import forecastRouter from './router/v1/forecast.js';


const app = new Koa();
const port = 7593;

app
.use(forecastRouter.routes())
.use(forecastRouter.allowedMethods())
.use(cors())
.use(koaBody)
.use(morgan('combined', {stream}));

app.listen(port, () => {
    console.log(`server is listening to port ${port}`);
});