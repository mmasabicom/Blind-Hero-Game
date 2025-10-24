
import React from 'react';
import { Team } from '../types';

interface TeamSelectorProps {
  onSelectTeam: (team: Team) => void;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({ onSelectTeam }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-5xl font-bold mb-4 text-cyan-400">لعبة البطل الأعمى</h1>
      <p className="text-xl mb-12 text-gray-300">اختر فريقك للبدء</p>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        <button
          onClick={() => onSelectTeam(Team.Viewer)}
          className="flex-1 p-8 bg-gray-800 rounded-lg shadow-lg hover:bg-cyan-500 hover:scale-105 transform transition-all duration-300 border-2 border-cyan-400"
        >
          <h2 className="text-3xl font-bold mb-2">الفريق المشاهد</h2>
          <p className="text-lg text-gray-400">يمكنك رؤية البطل والخريطة، لكن لا يمكنك التحكم به. مهمتك هي توجيه الفريق الآخر.</p>
        </button>
        <button
          onClick={() => onSelectTeam(Team.Controller)}
          className="flex-1 p-8 bg-gray-800 rounded-lg shadow-lg hover:bg-purple-500 hover:scale-105 transform transition-all duration-300 border-2 border-purple-400"
        >
          <h2 className="text-3xl font-bold mb-2">الفريق المتحكم</h2>
          <p className="text-lg text-gray-400">يمكنك التحكم بالبطل باستخدام الأسهم، لكن لا يمكنك رؤية الخريطة. اعتمد على توجيهات فريقك.</p>
        </button>
      </div>
    </div>
  );
};

export default TeamSelector;
