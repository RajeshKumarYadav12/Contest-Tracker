import { useContext, useState, useEffect } from "react";
import { ContestContext } from "../../context/ContestContext";
import ContestCard from "../../Components/ContestCard/ContestCard";
import "./Home.css";

const Home = () => {
  const { contests } = useContext(ContestContext);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [filteredContests, setFilteredContests] = useState([]);

  const platforms = ["Codeforces", "CodeChef", "Leetcode"];
  const contestTypes = ["Upcoming", "Live", "Past"];

  useEffect(() => {
    if (
      !selectedPlatform ||
      !selectedType ||
      !contests ||
      contests.length === 0
    ) {
      setFilteredContests([]);
      return;
    }

    const now = Date.now();

    let filtered = contests
      .filter((contest) => contest.platform === selectedPlatform)
      .map((contest) => ({
        ...contest,
        startTime: new Date(contest.startTime).getTime(),
        endTime: new Date(contest.endTime).getTime(),
      }))
      .filter((contest) => {
        if (selectedType === "Past") 
          return contest.endTime < now;
        if (selectedType === "Live")
          return contest.startTime <= now && contest.endTime >= now;
        if (selectedType === "Upcoming") 
          return contest.startTime > now;
        return false;
      });

    console.log(
      `Filtered contests for ${selectedPlatform} (${selectedType}):`,
      filtered
    );

    setFilteredContests(filtered);
  }, [contests, selectedPlatform, selectedType]);

  return (
    <div className="home-container">
      <h1 className="home-title">🚀 CP Contest Tracker</h1>

      {/* Platform Selection */}
      <div className="filter-container">
        <h3>Select Platform:</h3>
        <div className="platform-buttons">
          {platforms.map((platform) => (
            <button
              key={platform}
              className={`platform-btn ${
                selectedPlatform === platform ? "active" : ""
              }`}
              onClick={() => setSelectedPlatform(platform)}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      {/* Contest Type Selection */}
      <div className="filter-container">
        <h3>Select Contest Type:</h3>
        <div className="contest-type-buttons">
          {contestTypes.map((type) => (
            <button
              key={type}
              className={`contest-type-btn ${
                selectedType === type ? "active" : ""
              }`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Contest List */}
      <div className="contest-container">
        {selectedPlatform && selectedType ? (
          filteredContests.length > 0 ? (
            filteredContests.map((contest) => (
              <ContestCard key={contest._id || contest.id} contest={contest} />
            ))
          ) : (
            <p className="no-contests">
              No {selectedType.toLowerCase()} contests found for{" "}
              {selectedPlatform}.
            </p>
          )
        ) : (
          <p className="no-contests">
            Please select a platform and contest type to view contests.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
