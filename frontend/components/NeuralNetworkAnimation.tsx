import React from "react";

const NeuralNetworkAnimation = () => {
  return (
    <div className="relative w-full h-full min-h-[180px]">
      {/* Neural nodes */}
      <div className="absolute top-1/4 left-1/6 w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
      <div className="absolute top-2/3 left-1/6 w-3 h-3 rounded-full bg-purple-500 animate-pulse delay-100"></div>
      <div className="absolute top-1/2 left-1/6 w-3 h-3 rounded-full bg-purple-500 animate-pulse delay-200"></div>

      <div className="absolute top-1/5 left-2/5 w-3 h-3 rounded-full bg-indigo-500 animate-pulse delay-300"></div>
      <div className="absolute top-2/5 left-2/5 w-3 h-3 rounded-full bg-indigo-500 animate-pulse delay-400"></div>
      <div className="absolute top-3/5 left-2/5 w-3 h-3 rounded-full bg-indigo-500 animate-pulse delay-500"></div>
      <div className="absolute top-4/5 left-2/5 w-3 h-3 rounded-full bg-indigo-500 animate-pulse delay-600"></div>

      <div className="absolute top-1/4 left-3/5 w-3 h-3 rounded-full bg-indigo-500 animate-pulse delay-700"></div>
      <div className="absolute top-1/2 left-3/5 w-3 h-3 rounded-full bg-indigo-500 animate-pulse delay-800"></div>
      <div className="absolute top-3/4 left-3/5 w-3 h-3 rounded-full bg-indigo-500 animate-pulse delay-900"></div>

      <div className="absolute top-2/5 left-4/5 w-3 h-3 rounded-full bg-fuchsia-500 animate-pulse delay-1000"></div>
      <div className="absolute top-3/5 left-4/5 w-3 h-3 rounded-full bg-fuchsia-500 animate-pulse delay-1100"></div>

      {/* Neural connections */}
      <svg className="absolute inset-0 w-full h-full">
        {/* Layer 1 to 2 connections */}
        <line
          x1="16.7%"
          y1="25%"
          x2="40%"
          y2="20%"
          stroke="#A855F7"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <line
          x1="16.7%"
          y1="25%"
          x2="40%"
          y2="40%"
          stroke="#A855F7"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <line
          x1="16.7%"
          y1="25%"
          x2="40%"
          y2="60%"
          stroke="#A855F7"
          strokeWidth="1"
          strokeOpacity="0.5"
        />

        <line
          x1="16.7%"
          y1="50%"
          x2="40%"
          y2="20%"
          stroke="#A855F7"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <line
          x1="16.7%"
          y1="50%"
          x2="40%"
          y2="40%"
          stroke="#A855F7"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <line
          x1="16.7%"
          y1="50%"
          x2="40%"
          y2="60%"
          stroke="#A855F7"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <line
          x1="16.7%"
          y1="50%"
          x2="40%"
          y2="80%"
          stroke="#A855F7"
          strokeWidth="1"
          strokeOpacity="0.5"
        />

        <line
          x1="16.7%"
          y1="66.7%"
          x2="40%"
          y2="40%"
          stroke="#A855F7"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <line
          x1="16.7%"
          y1="66.7%"
          x2="40%"
          y2="60%"
          stroke="#A855F7"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <line
          x1="16.7%"
          y1="66.7%"
          x2="40%"
          y2="80%"
          stroke="#A855F7"
          strokeWidth="1"
          strokeOpacity="0.5"
        />

        {/* Layer 2 to 3 connections */}
        <line
          x1="40%"
          y1="20%"
          x2="60%"
          y2="25%"
          stroke="#6366F1"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <line
          x1="40%"
          y1="20%"
          x2="60%"
          y2="50%"
          stroke="#6366F1"
          strokeWidth="1"
          strokeOpacity="0.5"
        />

        <line
          x1="40%"
          y1="40%"
          x2="60%"
          y2="25%"
          stroke="#6366F1"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <line
          x1="40%"
          y1="40%"
          x2="60%"
          y2="50%"
          stroke="#6366F1"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <line
          x1="40%"
          y1="40%"
          x2="60%"
          y2="75%"
          stroke="#6366F1"
          strokeWidth="1"
          strokeOpacity="0.5"
        />

        <line
          x1="40%"
          y1="60%"
          x2="60%"
          y2="50%"
          stroke="#6366F1"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <line
          x1="40%"
          y1="60%"
          x2="60%"
          y2="75%"
          stroke="#6366F1"
          strokeWidth="1"
          strokeOpacity="0.5"
        />

        <line
          x1="40%"
          y1="80%"
          x2="60%"
          y2="75%"
          stroke="#6366F1"
          strokeWidth="1"
          strokeOpacity="0.5"
        />

        {/* Layer 3 to 4 connections */}
        <line
          x1="60%"
          y1="25%"
          x2="80%"
          y2="40%"
          stroke="#6366F1"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <line
          x1="60%"
          y1="50%"
          x2="80%"
          y2="40%"
          stroke="#6366F1"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <line
          x1="60%"
          y1="50%"
          x2="80%"
          y2="60%"
          stroke="#6366F1"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <line
          x1="60%"
          y1="75%"
          x2="80%"
          y2="60%"
          stroke="#6366F1"
          strokeOpacity="0.5"
        />
      </svg>
    </div>
  );
};

export default NeuralNetworkAnimation;
