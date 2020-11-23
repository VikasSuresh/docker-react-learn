const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const redis = require("redis");

const app = express();

app.use(cors())

app.use(bodyParser.json())

const {Pool} = require('pg')

const client = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PWD,
    port: process.env.PG_PORT
})

client.on('error',(err)=>{console.log('Error',err)})

client
.query("CREATE TABLE IF NOT EXISTS VALUES (number INT)")
.catch(err => console.log(err))

const redisClient = redis.createClient({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    retry_strategy: () => 1000
})

const pub = redisClient.duplicate();

app.get('/',(req,res)=>{
res.status(200).send("Working")
})

app.get('/all',async (req,res)=>{
    const values = await client.query("SELECT * FROM VALUES ")
    res.status(200).send(values.rows)
})

app.get('/curr',async(req,res)=>{
    redisClient.hgetall('values',(err,values)=>{
        if(err) return res.status(400)
        res.status(200).send(values )
    })
})

app.post('/',async(req,res)=>{
    const i = parseInt(request.body.index);

    if(i>40) return res.status(422).send('Index too high')

    redisClient.hset('values',index,"NothingYet")
    pub.publish('insert',index);
    await client.query('INSERT INTO VALUES(number) VALUES($1)',[index])

    res.status(200).send({success:true})   
});

app.listen(3000,()=>{
    console.log('App Started')
})
