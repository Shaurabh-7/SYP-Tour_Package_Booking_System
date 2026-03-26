import sequelize, { testConnection } from './config/db.js';
import './models/index.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes/index.js';
import seedAdmin from './scripts/seedAdmin.js';

const app = express();
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

// Allow the frontend running on localhost:5173 or localhost:5174 to call this API
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // allow cookies
}));

app.use(express.json());
app.use(cookieParser());

sequelize.sync({ alter: true }).then(async () => {
  await testConnection();
  console.log('Database & tables created!');
  await seedAdmin();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api", router);

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
