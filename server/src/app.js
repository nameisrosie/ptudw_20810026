const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const port = 3000;

// cấu hình CORS cho phép clinet  truy cập API
app.use(cors());

// ghi log các request lên console
app.use(morgan('dev'));
// phân tích cú pháp JSON cho các request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/api/v1', require('./routes'));

app.get('/api/data', (req, res) => {
  const data = { name: "Example", value: 123 };
  res.header('Content-Type', 'application/json');
  // Hoặc dùng res.json() sẽ tự động đặt content-type
  res.json(data);
});
//error handling middleware
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//xu ly tat ca loi phat sinh trong ung dung
app.use(require('./middlewares/errorHandler'));


module.exports = app;
