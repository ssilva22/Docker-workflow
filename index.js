const express = require("express");
const mongoose= require("mongoose");
const session = require("session");
const redis = require("redis");
let RedisStore = require("connect-redis")(session);

const {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_IP,
    MONGO_PORT, 
    REDIS_URL, 
    REDIS_PORT, 
    SESSION_SECRET
} = require("./config/config");

let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
})

const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes")

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    mongoose
    .connect(mongoURL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:false})
    .then(()=> console.log("successfully connected to the DB"))
    .catch((err)=>{
        console.log(err)
        setTimeout(connectWithRetry,5000)
    })
}

connectWithRetry();

app.use(session({
    store: new RedisStore({client:redisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave:false,
        saveUninitialized:false,
        httpOnly: true,
        maxAge: 3000000
    }
}))

app.use(express.json());



app.get("/" ,(req,res) => {
    res.send("Hello There");
})

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);
const port = process.env.PORT || 3000;



app.listen(port, (()=>{
console.log(`listening on port ${port}`)
}));