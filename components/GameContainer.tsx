
import React from 'react';
import { Team, GameState, Position, CellType } from '../types';
import ViewerPanel from './ViewerPanel';
import ControllerPanel from './ControllerPanel';
import VoiceChat from './VoiceChat';
import WinModal from './WinModal';

interface GameContainerProps {
  team: Team;
  map: CellType[][];
  heroPosition: Position;
  goalPosition: Position;
  onMove: (dx: number, dy: number) => void;
  gameState: GameState;
  onReset: () => void;
}

const GameContainer: React.FC<GameContainerProps> = ({ team, map, heroPosition, goalPosition, onMove, gameState, onReset }) => {
  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 bg-gray-900 text-white font-sans">
      <header className="w-full text-center mb-6">
        <h1 className="text-4xl font-bold text-cyan-400">لعبة البطل الأعمى</h1>
        <p className="text-lg text-gray-300">
          أنت في: <span className={`font-bold ${team === Team.Viewer ? 'text-cyan-400' : 'text-purple-400'}`}>
            {team === Team.Viewer ? 'الفريق المشاهد' : 'الفريق المتحكم'}
          </span>
        </p>
      </header>
      
      <main className="flex-grow flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
           {team === Team.Viewer ? (
            <ViewerPanel map={map} heroPosition={heroPosition} goalPosition={goalPosition} />
          ) : (
            <ControllerPanel onMove={onMove} />
          )}
        </div>
        <div className="w-full lg:w-1/3">
          <VoiceChat />
        </div>
      </main>
      
      {gameState === GameState.Won && <WinModal onReset={onReset} />}
    </div>
  );
};

export default GameContainer;
