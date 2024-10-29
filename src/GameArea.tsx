import { useState, useEffect } from "react";

const Ship = ({ position }: { position: number }) => {
  return (
    <div
      className="absolute bottom-8 w-8 h-8 bg-green-400 transition-all rounded-full"
      style={{ left: position }}
    ></div>
  );
};

const GameArea = () => {
  const SHIP_WIDTH = 32;
  const GAME_WIDTH = 600;
  const START_POSITION = GAME_WIDTH / 2 - SHIP_WIDTH / 2;
  const LEFT_MAX_POSITION = 0;
  const RIGHT_MAX_POSITION = GAME_WIDTH - SHIP_WIDTH;
  const MOVE_DISTANCE = 10;

  const [shipPosition, setShipPosition] = useState(START_POSITION);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setShipPosition((prevPosition) =>
        Math.max(LEFT_MAX_POSITION, prevPosition - MOVE_DISTANCE)
      );
    } else if (e.key === "ArrowRight") {
      setShipPosition((prevPosition) =>
        Math.min(RIGHT_MAX_POSITION, prevPosition + MOVE_DISTANCE)
      );
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div
      className={`bg-gray-700 relative w-[${GAME_WIDTH}px] h-[${GAME_WIDTH}px]`}
    >
      <Ship position={shipPosition} />
    </div>
  );
};

export default GameArea;
