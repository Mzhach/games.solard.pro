import * as express from 'express';
import * as dotenv from 'dotenv';
import * as socketio from 'socket.io';
import * as server from 'http';
import * as path from 'path';

import {TicTacRouter} from './tictactoe/router';

dotenv.config();
const port = process.env.SERVER_PORT || 3000;
const app = express();
const http = server.createServer(app);
const io = socketio(http);


app.use('/bootstrap', express.static(path.join(__dirname, '../../node_modules', '/bootstrap','/dist')));
app.use('/client', express.static(path.join(__dirname, '../../build', '/client')))

app.get('/', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../../public', '/html', '/index.html'));
});

app.use('/tictactoe', TicTacRouter);
app.set('io', io);

http.listen(port, () => {
    console.log(`listening on *:${port}`);
});