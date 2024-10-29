import { useState, useEffect } from "react";

enum EnemyDirection {
  Left = "left",
  Right = "right",
}

interface EnemyPosition {
  left: number;
  top: number;
}

const Ship = ({ leftPosition }: { leftPosition: number }) => {
  return (
    <div
      className="absolute bottom-8 w-8 h-8 bg-green-400 transition-all rounded-full"
      style={{ left: leftPosition }}
    ></div>
  );
};

const Enemy = ({ position }: { position: EnemyPosition }) => {
  const { left, top } = position;
  return (
    <div
      className="absolute bg-yellow-300 w-8 h-8 rounded-full"
      style={{ left: left, top: top }}
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
  const ENEMY_SPEED = 2;

  const [shipPosition, setShipPosition] = useState(START_POSITION);
  const [enemies, setEnemies] = useState<EnemyPosition[]>([]);
  const [enemyDirection, setEnemyDirection] = useState<EnemyDirection>(
    EnemyDirection.Right
  );

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

  const initializeEnemies = () => {
    const newEnemies: EnemyPosition[] = [];
    const HORIZONTAL_SPACING = 60;
    const VERTICAL_SPACING = 50;
    const NUM_ENEMIES_PER_ROW = 8;

    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < NUM_ENEMIES_PER_ROW; i++) {
        newEnemies.push({
          left: i * HORIZONTAL_SPACING + 50,
          top: row * VERTICAL_SPACING + 50,
        });
      }
    }

    setEnemies(newEnemies);
  };

  const moveEnemies = () => {
    setEnemies((prevEnemies) => {
      const leftMostEnemy = Math.min(...prevEnemies.map((enemy) => enemy.left));
      const rightMostEnemy = Math.max(
        ...prevEnemies.map((enemy) => enemy.left)
      );

      if (rightMostEnemy >= RIGHT_MAX_POSITION) {
        setEnemyDirection(EnemyDirection.Left);
      } else if (leftMostEnemy <= LEFT_MAX_POSITION) {
        setEnemyDirection(EnemyDirection.Right);
      }

      const movement =
        enemyDirection === EnemyDirection.Right ? ENEMY_SPEED : -ENEMY_SPEED;

      return prevEnemies.map((enemy) => ({
        ...enemy,
        left: enemy.left + movement,
      }));
    });
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    initializeEnemies();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const moveEnemiesInterval = setInterval(moveEnemies, 50);
    return () => clearInterval(moveEnemiesInterval);
  }, [enemyDirection]);

  return (
    <div className={`bg-gray-700 relative w-[600px] h-[600px]`}>
      {enemies.map((position, idx) => (
        <Enemy position={position} key={idx} />
      ))}
      <Ship leftPosition={shipPosition} />
    </div>
  );
};

export default GameArea;
