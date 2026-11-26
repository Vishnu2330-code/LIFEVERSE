import React from 'react';
import { Globe2, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import World3DViewer from '../../components/three/World3DViewer.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';

export const ExplorePage = () => {
  const sampleWorld = {
    theme: 'futuristic_city',
    buildings: [
      { buildingId: '1', buildingType: 'learning_library', name: 'Grand Library', gridX: 3, gridY: 3, level: 2 },
      { buildingId: '2', buildingType: 'productivity_tower', name: 'Productivity Spire', gridX: 5, gridY: 5, level: 3 },
      { buildingId: '3', buildingType: 'fitness_arena', name: 'Titan Arena', gridX: 6, gridY: 2, level: 1 },
      { buildingId: '4', buildingType: 'meditation_garden', name: 'Zen Garden', gridX: 2, gridY: 6, level: 1 },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center space-y-3">
        <Badge variant="purple">Metaverse Preview</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-heading">
          Explore the LIFEVERSE Islands
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          Interactive showcase of how a player's real-life accomplishments build their 3D territory.
        </p>
      </div>

      <GlassCard className="p-6 border-cyan-500/30">
        <World3DViewer world={sampleWorld} className="h-[520px]" />
      </GlassCard>

      <div className="text-center pt-4">
        <Link to="/register">
          <Button size="xl" variant="primary" icon={ArrowRight}>
            Claim Your Free Starting Island
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ExplorePage;
