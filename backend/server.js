const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server in ${process.env.MODE} at PORT:${process.env.PORT}`);
});
