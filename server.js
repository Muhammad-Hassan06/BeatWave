const dns = require('node:dns');
require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
dns.setServers(['1.1.1.1', '8.8.8.8']); 

connectDB();

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});