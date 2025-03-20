import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ContestContext = createContext();

// Exporting the backend API URL so it can be reused in other files
export const API_URL = "http://localhost:4000/api/contests";

export const ContestProvider = ({ children }) => {
  const [contests, setContests] = useState([]);
  
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        if (res.data && Array.isArray(res.data.contests)) {
          setContests(res.data.contests); // Extracting the contests array
        } else {
          console.error("Unexpected API Response:", res.data);
          setContests([]); // Ensure contests is always an array
        }
      })
      .catch((err) => console.error("Error fetching contests:", err));
  }, []);

  const toggleBookmark = async (id) => {
    try {
      // Send request to the backend to toggle bookmark status
      await axios.put(`${API_URL}/bookmark/${id}`);

      // Update the local state to reflect the change
      setContests((prevContests) =>
        prevContests.map((contest) =>
          contest._id === id
            ? { ...contest, bookmarked: !contest.bookmarked }
            : contest
        )
      );
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  return (
    <ContestContext.Provider value={{ contests, toggleBookmark }}>
      {children}
    </ContestContext.Provider>
  );
};
