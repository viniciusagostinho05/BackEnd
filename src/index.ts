import 'reflect-metadata';
import { createServer } from 'http';
import app from './app';
import mongoose from 'mongoose';
mongoose.set('debug', true);
mongoose.connect("mongodb://alex:<db_password>@ac-jrzm0er-shard-00-00.43inxww.mongodb.net:27017,ac-jrzm0er-shard-00-01.43inxww.mongodb.net:27017,ac-jrzm0er-shard-00-02.43inxww.mongodb.net:27017/ProjectWork?ssl=true&replicaSet=atlas-bpfgcc-shard-0&authSource=admin&appName=Cluster0")
    .then(_ => {
        createServer(app).listen(3000, () => {
            console.log('Server listening on port 3000');
        });
    })
    .catch(err => {
        console.error(err);
    })
