
import React, { useState, useCallback, useEffect } from 'react';
import { Team, GameState, Position } from './types';
import { MAP_GRID, INITIAL_HERO_POSITION, GOAL_POSITION } from './constants';
import TeamSelector from './components/TeamSelector';
import GameContainer from './components/GameContainer';

const App: React.FC = () => {
  const [team, setTeam] = useState<Team | null>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.PreGame);
  const [heroPosition, setHeroPosition] = useState<Position>(INITIAL_HERO_POSITION);

  const handleSelectTeam = (selectedTeam: Team) => {
    setTeam(selectedTeam);
    setGameState(GameState.Running);
  };
  
  const resetGame = () => {
      setHeroPosition(INITIAL_HERO_POSITION);
      setGameState(GameState.Running);
  }

  const handleMove = useCallback((dx: number, dy: number) => {
    if (gameState !== GameState.Running) return;

    setHeroPosition(prevPos => {
      const newPos = { x: prevPos.x + dx, y: prevPos.y + dy };

      if (
        newPos.y >= 0 && newPos.y < MAP_GRID.length &&
        newPos.x >= 0 && newPos.x < MAP_GRID[0].length &&
        MAP_GRID[newPos.y][newPos.x] !== 1
      ) {
        if (newPos.x === GOAL_POSITION.x && newPos.y === GOAL_POSITION.y) {
          setGameState(GameState.Won);
        }
        return newPos;
      }
      return prevPos;
    });
  }, [gameState]);

  if (!team) {
    return <TeamSelector onSelectTeam={handleSelectTeam} />;
  }

  return (
    <GameContainer
      team={team}
      map={MAP_GRID}
      heroPosition={heroPosition}
      goalPosition={GOAL_POSITION}
      onMove={handleMove}
      gameState={gameState}
      onReset={resetGame}
    />
  );
};

export default App;
