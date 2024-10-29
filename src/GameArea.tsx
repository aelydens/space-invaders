import { useState, useEffect } from "react";

const GAME_CONSTANTS = {
  DIMENSIONS: {
    WIDTH: 600,
    SHIP_WIDTH: 32,
  },
  POSITIONS: {
    LEFT_MAX: 0,
    RIGHT_MAX: 600 - 32, // WIDTH - SHIP_WIDTH
    START: (600 - 32) / 2, // (WIDTH - SHIP_WIDTH) / 2
  },
  MOVEMENT: {
    SHIP_DISTANCE: 10,
    ENEMY_SPEED: 2,
    UPDATE_INTERVAL: 50,
  },
  ENEMY: {
    ROWS: 2,
    PER_ROW: 8,
    SPACING: {
      HORIZONTAL: 60,
      VERTICAL: 50,
    },
    START: {
      X: 50,
      Y: 50,
    },
  },
} as const;

enum EnemyDirection {
  Left = "left",
  Right = "right",
}

interface EnemyPosition {
  left: number;
  top: number;
}

interface ShipProps {
  leftPosition: number;
}

interface EnemyProps {
  position: EnemyPosition;
}

const Ship: React.FC<ShipProps> = ({ leftPosition }) => {
  return (
    <div
      className="absolute bottom-8 w-8 h-8 bg-green-400 transition-all rounded-full"
      style={{ left: leftPosition }}
    />
  );
};

const Enemy: React.FC<EnemyProps> = ({ position }) => {
  const { left, top } = position;
  return (
    <div
      className="absolute bg-yellow-300 w-8 h-8 rounded-full"
      style={{ left: left, top: top }}
    />
  );
};

const GameArea: React.FC = () => {
  const [shipPosition, setShipPosition] = useState(
    GAME_CONSTANTS.POSITIONS.START
  );
  const [enemies, setEnemies] = useState<EnemyPosition[]>([]);
  const [enemyDirection, setEnemyDirection] = useState<EnemyDirection>(
    EnemyDirection.Right
  );

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setShipPosition((prevPosition) =>
        Math.max(
          GAME_CONSTANTS.POSITIONS.LEFT_MAX,
          prevPosition - GAME_CONSTANTS.MOVEMENT.SHIP_DISTANCE
        )
      );
    } else if (e.key === "ArrowRight") {
      setShipPosition((prevPosition) =>
        Math.min(
          GAME_CONSTANTS.POSITIONS.RIGHT_MAX,
          prevPosition + GAME_CONSTANTS.MOVEMENT.SHIP_DISTANCE
        )
      );
    }
  };

  const initializeEnemies = () => {
    const newEnemies: EnemyPosition[] = [];

    for (let row = 0; row < GAME_CONSTANTS.ENEMY.ROWS; row++) {
      for (let i = 0; i < GAME_CONSTANTS.ENEMY.PER_ROW; i++) {
        newEnemies.push({
          left:
            i * GAME_CONSTANTS.ENEMY.SPACING.HORIZONTAL +
            GAME_CONSTANTS.ENEMY.START.X,
          top:
            row * GAME_CONSTANTS.ENEMY.SPACING.VERTICAL +
            GAME_CONSTANTS.ENEMY.START.Y,
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

      if (rightMostEnemy >= GAME_CONSTANTS.POSITIONS.RIGHT_MAX) {
        setEnemyDirection(EnemyDirection.Left);
      } else if (leftMostEnemy <= GAME_CONSTANTS.POSITIONS.LEFT_MAX) {
        setEnemyDirection(EnemyDirection.Right);
      }

      const movement =
        enemyDirection === EnemyDirection.Right
          ? GAME_CONSTANTS.MOVEMENT.ENEMY_SPEED
          : -GAME_CONSTANTS.MOVEMENT.ENEMY_SPEED;

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
    const moveEnemiesInterval = setInterval(
      moveEnemies,
      GAME_CONSTANTS.MOVEMENT.UPDATE_INTERVAL
    );
    return () => clearInterval(moveEnemiesInterval);
  }, [enemyDirection]);

  return (
    <div className="bg-gray-700 relative w-[600px] h-[600px]">
      {enemies.map((position, idx) => (
        <Enemy position={position} key={idx} />
      ))}
      <Ship leftPosition={shipPosition} />
    </div>
  );
};

export default GameArea;
