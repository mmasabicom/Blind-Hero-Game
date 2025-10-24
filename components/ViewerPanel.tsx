
import React from 'react';
import { Position, CellType } from '../types';

interface ViewerPanelProps {
  map: CellType[][];
  heroPosition: Position;
  goalPosition: Position;
}

const ViewerPanel: React.FC<ViewerPanelProps> = ({ map, heroPosition }) => {
  const getCellClass = (cell: CellType, x: number, y: number) => {
    if (heroPosition.x === x && heroPosition.y === y) {
      return 'bg-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.8)]';
    }
    switch (cell) {
      case CellType.Wall:
        return 'bg-gray-700';
      case CellType.Goal:
        return 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]';
      case CellType.Empty:
      default:
        return 'bg-gray-800';
    }
  };

  return (
    <div className="flex-grow bg-gray-800/50 p-4 rounded-lg border-2 border-cyan-400 flex flex-col items-center justify-center shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">شاشة الفريق المشاهد</h2>
       <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${map[0].length}, minmax(0, 1fr))` }}>
        {map.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`aspect-square w-full h-full rounded-sm transition-colors duration-200 ${getCellClass(cell, x, y)}`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ViewerPanel;
