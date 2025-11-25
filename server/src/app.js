const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Server is running successfully!",
        docs: "Access data at /api/data or /api/v1"
    });
});

// Existing routes
app.use('/api/v1', require('./routes'));

app.get('/api/data', (req, res) => {
  const data = { name: "Example", value: 123 };
  res.json(data);
});

// Error handling (keep this at the bottom)
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use(require('./middlewares/errorHandler'));

module.exports = app;