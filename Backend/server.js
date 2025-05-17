const express = require('express');
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser")
dotenv.config();
const connectDB = require("./DB/Connect");
const authRoutes = require("./Routes/authRoutes");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000 ;

app.use("/api/auth/", authRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDB(); // Connect to MongoDB

});

