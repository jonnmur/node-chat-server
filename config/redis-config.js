import 'dotenv/config';

import { createClient } from 'redis';

export const redisClient = createClient({
    url: 'redis://' + process.env.REDIS_USERNAME + ':' + process.env.REDIS_PASSWORD + '@' + process.env.REDIS_HOST + ':' + process.env.REDIS_PORT,
    legacyMode: true
})

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});

redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

redisClient.connect();
