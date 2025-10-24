
import React, { useEffect, useState } from 'react';

interface ControllerPanelProps {
  onMove: (dx: number, dy: number) => void;
}

const ArrowKey: React.FC<{ direction: string; active: boolean }> = ({ direction, active }) => {
  const baseClasses = "w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-md border-2 border-purple-400 transition-all duration-150";
  const activeClasses = "bg-purple-500 scale-110 shadow-lg";
  const inactiveClasses = "bg-gray-700";
  
  return (
      <div className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
        <span className="text-3xl font-bold">{direction}</span>
      </div>
  );
};

const ControllerPanel: React.FC<ControllerPanelProps> = ({ onMove }) => {
    const [activeKey, setActiveKey] = useState<string | null>(null);

    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let dx = 0;
      let dy = 0;
      switch (e.key) {
        case 'ArrowUp':
          dy = -1;
          break;
        case 'ArrowDown':
          dy = 1;
          break;
        case 'ArrowLeft':
          dx = -1;
          break;
        case 'ArrowRight':
          dx = 1;
          break;
        default:
          return;
      }
      setActiveKey(e.key);
      onMove(dx, dy);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            setActiveKey(null);
        }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [onMove]);

  return (
    <div className="flex-grow bg-gray-800/50 p-6 rounded-lg border-2 border-purple-400 flex flex-col items-center justify-center shadow-lg text-center">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">شاشة الفريق المتحكم</h2>
      <p className="text-lg text-gray-300 mb-8">استخدم أزرار الأسهم للتحكم في البطل. الشاشة سوداء عن قصد!</p>
      
      <div className="grid grid-cols-3 gap-2 justify-items-center">
            <div className="col-start-2">
                <ArrowKey direction="↑" active={activeKey === 'ArrowUp'} />
            </div>
            <div>
                <ArrowKey direction="←" active={activeKey === 'ArrowLeft'} />
            </div>
            <div>
                <ArrowKey direction="↓" active={activeKey === 'ArrowDown'} />
            </div>
            <div>
                <ArrowKey direction="→" active={activeKey === 'ArrowRight'} />
            </div>
        </div>

    </div>
  );
};

export default ControllerPanel;
