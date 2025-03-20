import axios from "axios";
import Contest from "../models/Contest.js";

// Fetch contests from Codeforces and save to MongoDB
export const fetchContests = async (req, res) => {
  try {
    // Fetch contest data from Codeforces API
    const codeforcesRes = await axios.get("https://codeforces.com/api/contest.list");
    const codeforcesContests = codeforcesRes.data.result.map((contest) => ({
      name: contest.name,
      platform: "Codeforces",
      startTime: new Date(contest.startTimeSeconds * 1000),
      endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000),
      link: `https://codeforces.com/contests/${contest.id}`,
      solutionLink: null, 
    }));

    // Clear all existing contest data
    await Contest.deleteMany({}); 

    // Insert updated contests
    await Contest.insertMany(codeforcesContests);

    res.status(200).json({ message: "Codeforces contests saved successfully!", contests: codeforcesContests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Fetch all contests from database
export const getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find();
    res.json({ contests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch contests by platform
export const getContestsByPlatform = async (req, res) => {
  try {
    const { platform } = req.params;

    // Check if platform contains multiple values (comma-separated)
    const platforms = platform.includes(",") ? platform.split(",") : [platform];

    const contests = await Contest.find({ platform: { $in: platforms } });

    res.json({ contests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Fetch upcoming contests
export const getUpcomingContests = async (req, res) => {
  try {
    const now = new Date();
    const contests = await Contest.find({ startTime: { $gt: now } }).sort({ startTime: 1 });
    res.json({ contests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch past contests
export const getPastContests = async (req, res) => {
  try {
    const now = new Date();
    const contests = await Contest.find({ endTime: { $lt: now } }).sort({ endTime: -1 });
    res.json({ contests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle bookmark for a contest
export const toggleBookmark = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    contest.bookmarked = !contest.bookmarked;
    await contest.save();

    res.json({ message: "Bookmark updated!", contest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addSolutionLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { solutionLink } = req.body;

    const contest = await Contest.findById(id);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    contest.solutionLink = solutionLink; // Update solution link
    await contest.save();

    res.json({ message: "Solution link added successfully!", contest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};