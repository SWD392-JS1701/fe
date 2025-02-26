import React from "react";
import { FaChevronDown } from "react-icons/fa";

const Comment = () => {
  const comments = [
    {
      id: 1,
      username: "skl100n",
      time: "5 years ago",
      content:
        "My boi Jojj hasn't been sleeping, so we shouldn't sleep on him too",
      replies: 2,
    },
    {
      id: 2,
      username: "marytherese9740",
      time: "5 years ago (edited)",
      content:
        "What I think happened in the video is: The copilot took off his eye and proceeded to become the new villain to make joji happy",
      replies: 3,
    },
    {
      id: 3,
      username: "arifputra1687",
      time: "5 years ago",
      content:
        'Director: "How many technological future space effects do u want?" Jojj : "No"',
      replies: 4,
    },
    {
      id: 4,
      username: "xinquiote9572",
      time: "5 years ago",
      content:
        "This is quiet sad. He become the next villain to make his friend motivated again.",
      replies: 5,
    },
  ];

  return (
    <div style={{ padding: "20px 80px", fontFamily: "Arial, sans-serif" }}>
      <h3>4 Comments</h3>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Add a comment..."
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>
      {comments.map((comment) => (
        <div key={comment.id} style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <img
              src={`https://i.pravatar.cc/40?u=${comment.username}`}
              alt={comment.username}
              style={{ borderRadius: "50%", marginRight: "10px" }}
            />
            <div>
              <strong>{comment.username}</strong>
              <span style={{ marginLeft: "10px", color: "#666" }}>
                {comment.time}
              </span>
              <p>{comment.content}</p>
            </div>
          </div>

          {/* Reply button */}
          <button
            style={{
              color: "#065fd4",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaChevronDown style={{ marginRight: "5px" }} /> {comment.replies}
            replies
          </button>
        </div>
      ))}
    </div>
  );
};

export default Comment;
