import express from 'express';
import router from './routes/api.route.js';
import cors from 'cors';
import connectDB from './config/db.js'; // Thêm dòng này

const PORT = process.env.PORT || 5000;

const app = express();

app.use(
    cors({
      origin: "*", 
      methods: "GET,POST,PUT,DELETE", 
      credentials: true,
    })
  );

app.use(express.json({ limit: '20mb' }));

app.use('/api', router);

// Kết nối với MongoDB trước khi khởi động server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server is listening at PORT ${PORT}`));
});