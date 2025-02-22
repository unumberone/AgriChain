import express from 'express';
import router from './routes/api.route.js';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use('/api/data', router);

app.listen(PORT, () => console.log(`Server is listening at PORT ${PORT}`));
