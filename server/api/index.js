const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const app = express();

// middlewares
app.use(express.json());
app.use(cors()); // chỉnh origin nếu cần

// example routes
app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok" });
});

// Nếu bạn đã có router trong server.js, bạn có thể import và sử dụng:
// const apiRouter = require('../path/to/your/router');
// app.use('/api/v1', apiRouter);

// export handler for Vercel
module.exports = serverless(app);
