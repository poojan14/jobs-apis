require('dotenv').config();
require('express-async-errors');
const express=require('express')
const app=express()

const connectDB=require('./db/connect');


// extra security packages
//HTTP HEADER protect numerous attack
//cross origin resource sharing, api accessible from different domain to public
//xss sanitize user input in req.body,req.query,req.params no cross site scripting attack

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

//error handler
const notFoundMiddleware=require('./middleware/not-found')
const errorHandlerMiddleware=require('./middleware/error-handler')

const authenticateUser = require('./middleware/authentication');
app.use(express.json());



//bcoz push to heroku
app.set('trust proxy', 1);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/', (req, res) => {
    res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
  });
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

//routes
const authRouter=require('./routes/auth');
const jobsRouter=require('./routes/jobs');


//routes
8
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',authenticateUser,jobsRouter);

//middleware use
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port= process.env.PORT || 5001
const start = async()=>{
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(port,()=>{
            console.log(`Server is listening on ${port}`)
        });
    }
    catch(err){
        console.log(err);
    }
};
start();