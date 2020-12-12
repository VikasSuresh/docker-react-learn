var RedisClustr = require('redis-clustr');
var RedisClient = require('redis');

var redisClient = new RedisClustr({
    servers: [
        {
            host:process.env.REDIS_HOST,
            port:process.env.REDIS_PORT,
        }
    ],
    createClient: function (port, host) {
        // this is the default behaviour
        return RedisClient.createClient(port, host);
    }
});

function fib(index){
    if(index<2) return 1;
    return fib(index-2) + fib(index-1)
}

redisClient.on('message',(channel,message)=>{
    redisClient.hset('values',message,(fib(parseInt(message))))
})

redisClient.subscribe('insert')