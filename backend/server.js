const express = require("express");
const cors = require("cors");
const roomRoutes = require("./routes/roomRoutes"); // Ensure this file exists

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/rooms", roomRoutes); // Make sure roomRoutes is properly imported

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
