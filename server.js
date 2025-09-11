const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"], // allow both
  methods: ["GET", "POST"],
  credentials: true
}));


// ✅ Connect to MongoDB Atlas
mongoose.connect(
  "mongodb+srv://therapistUser:Raj2005@cluster0.iwqtylq.mongodb.net/therapisto?retryWrites=true&w=majority&appName=Cluster0"
)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Schema for Reviews
const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  message: { type: String, required: true },
  datetime: { type: Date, default: Date.now }
});

const Review = mongoose.model("Review", reviewSchema);

// ✅ Routes
app.get("/", (req, res) => {
  res.send("🚀 Therapisto Review API is running!");
});

// Get all reviews
app.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ datetime: -1});
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Add a new review
app.post("/addReview", async (req, res) => {
  const { name, rating, message } = req.body;
  try {
    const review = new Review({ name, rating, message });
    await review.save();
    res.json({ success: true, review });
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(500).json({ error: "Failed to save review" });
  }
});


// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
