import { useContext } from "react";
import { ContestContext } from "../../context/ContestContext";
import "./ContestCard.css";

const ContestCard = ({ contest }) => {
  const { toggleBookmark } = useContext(ContestContext);

  const now = new Date().getTime();
  const startTime = new Date(contest.startTime).getTime();
  const endTime = new Date(contest.endTime).getTime();

  let status, timeRemaining;

  if (endTime < now) {
    status = "Past";
    timeRemaining = "Contest Over";
  } else if (startTime <= now && endTime >= now) {
    status = "Live";
    timeRemaining = "Happening Now!";
  } else {
    status = "Upcoming";

    const totalMinutes = Math.floor((startTime - now) / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    timeRemaining = `${days}d ${hours}h ${minutes}m`;
  }

  return (
    <div className="contest-card">
      <h3 className="contest-title">{contest.name}</h3>

      <div className="details">
        <p className="contest-platform">Platform Name:- {contest.platform}</p>
        <p className="contest-date">
          Start Date:- {new Date(contest.startTime).toLocaleDateString()}{" "}
        </p>
        <p className="contest-timer">Remaining Time:- {timeRemaining}</p>
        <p className={`contest-status ${status.toLowerCase()}`}>
          Contest Status:- {status}
        </p>
      </div>
      <a
        href={contest.link}
        target="_blank"
        rel="noopener noreferrer"
        className="contest-link"
      >
        🔗 Visit Contest
      </a>

      {/* Show solution link only if available */}
      {status === "Past" && contest.solutionLink && (
        <a
          href={contest.solutionLink}
          target="_blank"
          rel="noopener noreferrer"
          className="solution-link"
        >
          🎥 Solution Video
        </a>
      )}

      {/* Bookmark Button */}
      <button
        onClick={() => toggleBookmark(contest._id)}
        className={`bookmark-btn ${contest.bookmarked ? "bookmarked" : ""}`}
      >
        {contest.bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
      </button>
    </div>
  );
};

export default ContestCard;
