import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css";
import ContestCard from "../../Components/ContestCard/ContestCard";

const AdminPanel = () => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [contests, setContests] = useState([]);
  const [editingContestId, setEditingContestId] = useState(null);
  const [videoLinks, setVideoLinks] = useState({});

  // Fetch contests only for the selected platform
  useEffect(() => {
    if (!selectedPlatform) {
      setContests([]);
      return;
    }

    const fetchContests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/contests?platform=${selectedPlatform}`
        );

        if (!response.data.contests) {
          console.error("Invalid API response format:", response.data);
          setContests([]);
          return;
        }

        const now = new Date().getTime();
        const pastContests = response.data.contests.filter(
          (contest) =>
            contest.platform === selectedPlatform &&
            new Date(contest.endTime).getTime() < now
        );

        setContests(pastContests);
        setEditingContestId(null);
        setVideoLinks({}); // Reset video links input
      } catch (error) {
        console.error("Error fetching contests:", error);
        setContests([]);
      }
    };

    fetchContests();
  }, [selectedPlatform]);

  // Handle updating video link
  const handleSaveVideoLink = async (contestId) => {
    if (!videoLinks[contestId]) {
      alert("Please enter a video link.");
      return;
    }

    try {
      console.log(
        "Updating contest:",
        contestId,
        "with video link:",
        videoLinks[contestId]
      );

      const response = await axios.put(
        `http://localhost:4000/api/contests/solution/${contestId}`, // ✅ Correct API route
        { videoLink: videoLinks[contestId] }
      );

      console.log("API Response:", response.data);

      if (response.status === 200) {
        alert("Video link updated successfully!");

        // Clear input field
        setVideoLinks((prev) => {
          const updatedLinks = { ...prev };
          delete updatedLinks[contestId];
          return updatedLinks;
        });

        setEditingContestId(null); // Exit edit mode

        // Refetch updated contests
        const updatedResponse = await axios.get(
          `http://localhost:4000/api/contests?platform=${selectedPlatform}`
        );

        const updatedContests = updatedResponse.data.contests.filter(
          (contest) =>
            contest.platform === selectedPlatform &&
            new Date(contest.endTime).getTime() < new Date().getTime()
        );

        setContests(updatedContests);
      } else {
        throw new Error("Failed to update contest.");
      }
    } catch (error) {
      console.error("Error updating contest:", error);
      alert("Failed to update contest. Please try again.");
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Panel</h2>
      <p className="admin-subtitle">
        Select a platform to upload or edit video solutions.
      </p>

      {/* Platform Selection Buttons */}
      <div className="platform-buttons">
        {["Codeforces", "CodeChef", "Leetcode"].map((platform) => (
          <button
            key={platform}
            className={`platform-btn ${
              selectedPlatform === platform ? "active" : ""
            }`}
            onClick={() => {
              setSelectedPlatform(platform);
              setContests([]);
              setEditingContestId(null);
              setVideoLinks({});
            }}
          >
            {platform}
          </button>
        ))}
      </div>

      {/* Display Past Contests */}
      {selectedPlatform && contests.length > 0 ? (
        <div className="contest-container">
          {contests.map((contest) => (
            <div key={contest._id} className="contest-card-wrapper">
              <ContestCard key={contest._id || contest.id} contest={contest} />
              {/* Edit Video Link Section (Only in Admin Panel) */}
              <div className="edit-video-section">
                {editingContestId === contest._id ? (
                  <>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter new video link"
                      value={videoLinks[contest._id] || ""}
                      onChange={(e) =>
                        setVideoLinks({
                          ...videoLinks,
                          [contest._id]: e.target.value,
                        })
                      }
                    />
                    <button
                      className="admin-submit-btn"
                      onClick={() => handleSaveVideoLink(contest._id)}
                    >
                      Save
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setEditingContestId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="edit-btn"
                    onClick={() => setEditingContestId(contest._id)}
                  >
                    Edit Video Link
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : selectedPlatform ? (
        <p className="no-contests">
          No past contests found for {selectedPlatform}.
        </p>
      ) : null}
    </div>
  );
};

export default AdminPanel;
