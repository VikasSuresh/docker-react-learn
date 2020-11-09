const express = require('express');
const ioredis = require('ioredis');

const app = express();
const redis = new ioredis({
  port: 6379, // Redis port
  host: "redis-server", // Redis host
})

redis.set('visit',0)


app.get('/', async (req, res) => {
  const visited = parseInt(await redis.get('visit'));
  res.status(200).send(`This Page has been visited:-${visited}`)
  await redis.set('visit',visited+1)
});

app.listen(8080, () => {
  console.log('Listening on port 8080');
});