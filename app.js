require('dotenv').config();
require('express-async-errors');

// extra security packages
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors') 

// swagger docs
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');


const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
// routers
const authRouter = require('./routes/auth');
const coursesRouter = require('./routes/Courses');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());



app.use(helmet());
app.use(cors());
app.use(xss());

app.use(express.static('./public'))

app.get('/',(req,res)=>{
  res.send('<a href="https://eduroute-api.onrender.com/api-docs">view docs</a>')
})

app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument))


// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/courses', authenticateUser, coursesRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log('Server is listening on port ' + port )
    );
  } catch (error) {
    console.log('starter error : ' + error);
  }
};

start();
