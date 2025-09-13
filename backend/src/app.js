const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const partnerRoutes = require('./routes/foodPartner.routes');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/partner', partnerRoutes);

module.exports = app;