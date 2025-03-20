import express from "express";
import { 
  fetchContests, 
  getAllContests, 
  getContestsByPlatform, 
  getUpcomingContests, 
  getPastContests, 
  toggleBookmark,
  addSolutionLink 
} from "../controllers/contestController.js";  

const router = express.Router();

router.get("/fetch", fetchContests);  
router.get("/", getAllContests);
router.get("/platform/:platform", getContestsByPlatform);  
router.get("/upcoming", getUpcomingContests);  
router.get("/past", getPastContests);
router.put("/bookmark/:id", toggleBookmark);
router.put("/solution/:id", addSolutionLink);  

export default router;
