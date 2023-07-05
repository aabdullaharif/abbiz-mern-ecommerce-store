import React from "react";

const Message = ({ message }) => {
  return (
    <div>
      <h2 className="text-3xl text-center">{message}</h2>
    </div>
  );
};

export default Message;
