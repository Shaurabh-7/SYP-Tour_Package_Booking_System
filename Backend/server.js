import sequelize from './config/db.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import router from '../Backend/routes/index.js';

const app = express();
app.use(express.json());

// Sync database (creates table automatically)
sequelize.sync().then(() => {
  console.log('Database & tables created!');
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

app.use(cookieParser());

app.use("/api", router);