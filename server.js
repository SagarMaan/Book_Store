require("dotenv").config({ path: "./config/.env" });

const { appConfig } = require("./config/config.js");

const userRoute = require("./routes/user.js");
const bookRoute = require("./routes/book.js");
const reviewRoute = require("./routes/review.js");
const cartRoute = require("./models/cart.js");
const orderRoute = require("./routes/order.js");

const connectDatabase = require("./config/database");
connectDatabase();

const cors = require("cors")

const express = require("express");
const app = express();



// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors())

app.use("/api/users", userRoute);
app.use("/api/book", bookRoute);
app.use("/api/review", reviewRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);

const PORT = appConfig.port;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
