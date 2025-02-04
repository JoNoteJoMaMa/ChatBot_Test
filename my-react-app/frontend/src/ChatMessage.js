import React from "react";

const extractImageAndText = (text) => {
  const regex = /!\[.*?\]\((https?:\/\/[^\s]+)\)\s*([\s\S]*)/; // Matches markdown image syntax and captures the entire description
  const match = text.match(regex);

  if (match) {
    return {
      imageUrl: match[1], // Extracted URL
      description: match[2].trim(), // Extracted description
    };
  }

  return {
    imageUrl: null,
    description: text.trim(), // If no URL, return the entire text as description
  };
};

function ChatMessage({ message }) {
  const { imageUrl, description } = extractImageAndText(message);

  return (
    <div className="chat-message">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Generated Chart"
          style={{ maxWidth: "100%", height: "auto", display: "block", marginBottom: "10px" }}
        />
      )}
      {description && <p style={{ whiteSpace: "pre-wrap" }}>{description}</p>}
    </div>
  );
}

export default ChatMessage;