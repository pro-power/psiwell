"use client";
//src/components/custom-cursor.tsx
// Import necessary React hooks and components
import React, { useEffect, useRef, useState } from "react";
// Define cursor colors
const CURSOR_COLORS = {
  h1: "green-400",
  button: "orange-500",
  default: "sky-500",
};
// Main CustomCursor component
const CustomCursor = () => {
  // Reference to the cursor element
  const cursorRef = useRef(null);
  // State to track cursor position
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // State to track cursor color
  const [cursorColor, setCursorColor] = useState("sky-500");
  // State to track click event
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    // Event listener for mouse movement
    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    // Event listener for mouse click
    const handleMouseDown = () => {
      setClicked(true);
      // Reset click state after 800 milliseconds
      setTimeout(() => {
        setClicked(false);
      }, 800);
    };
    // Event listener for mouseover (hover) on HTML elements
    const handleMouseOver = (e) => {
      // Get the HTML tag name
      const tagName = e.target.tagName.toLowerCase();
      // Set cursor color based on the tag, default to "sky-500"
      setCursorColor(CURSOR_COLORS[tagName] || CURSOR_COLORS["default"]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseover", handleMouseOver);
    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []); // useEffect runs only once on mount

  return (
    <>
      <div
        style={{ top: position.y, left: position.x }}
        ref={cursorRef}
        className={`fixed pointer-events-none rounded-full w-5 h-5 `}
      >
        <img src="/psi.png" alt="cursor" />
      </div>
    </>
  );
};

export default CustomCursor;
