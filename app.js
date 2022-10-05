require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const routes = require("./routes");
const responses = require("./helpers/responses");
const http = require("http").createServer(app);
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.set("trust proxy", 1);
app.use(
  cors({
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(responses);

const { PORT } = process.env;

app.use(routes);

http.listen(PORT, () => {
  console.log("server running on port ", PORT);
});
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSON))

module.exports = app;
