const app = require("./app");

const connectDatabase = require("./Database/dbcon");
const PORT = 5000;

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config();
}

// Connecting to database
connectDatabase();

const server = app.listen(PORT, () => {
    console.log(`Server is working on http://localhost:${PORT}`);
});


