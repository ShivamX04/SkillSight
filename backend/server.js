require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const {resume, selfDescription, jobDescription} = require("./src/services/temp")
const generateInterviewReport = require("./src/services/ai.service")
connectDB();


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("PORT VALUE:", process.env.PORT);
  console.log(`Server is running on port ${PORT}`);
});
