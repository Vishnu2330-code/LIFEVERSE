import React, { useState, useEffect } from 'react';
import { Globe2, Plus, ArrowUpCircle, Trash2, Check, Sparkles } from 'lucide-react';
import apiClient from '../services/api.js';
import World3DViewer from '../components/three/World3DViewer.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';

export const WorldPage = () => {
  const [world, setWorld] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [buildingType, setBuildingType] = useState('productivity_tower');
  const [gridX, setGridX] = useState(2);
  const [gridY, setGridY] = useState(2);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadWorldData();
  }, []);

  const loadWorldData = async () => {
    try {
      const res = await apiClient.get('/world');
      if (res.data) setWorld(res.data);
    } catch (err) {
      console.error('Failed to load world data:', err);
    }
  };

  const handlePlaceBuilding = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await apiClient.post('/world/buildings', {
        buildingType,
        gridX: parseInt(gridX, 10),
        gridY: parseInt(gridY, 10),
      });
      setIsPlaceModalOpen(false);
      loadWorldData();
    } catch (err) {
      setErrorMsg(err.message || 'Collision detected or slot occupied.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeBuilding = async (buildingId) => {
    try {
      await apiClient.patch(`/world/buildings/${buildingId}/upgrade`);
      loadWorldData();
      if (selectedBuilding) {
        setSelectedBuilding((prev) => ({ ...prev, level: prev.level + 1 }));
      }
    } catch (err) {
      console.error('Upgrade error:', err);
    }
  };

  const handleRemoveBuilding = async (buildingId) => {
    try {
      await apiClient.delete(`/world/buildings/${buildingId}`);
      setSelectedBuilding(null);
      loadWorldData();
    } catch (err) {
      console.error('Remove error:', err);
    }
  };

  const handleThemeChange = async (theme) => {
    try {
      await apiClient.patch('/world/theme', { theme });
      loadWorldData();
    } catch (err) {
      console.error('Theme update error:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white font-heading">3D Virtual World Builder</h1>
          <p className="text-xs text-slate-400 mt-1">
            Construct and upgrade architectural monuments driven by your real-life victories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" icon={Plus} onClick={() => setIsPlaceModalOpen(true)}>
            Place Building
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 3D World Canvas */}
        <GlassCard className="lg:col-span-8 p-4 flex flex-col items-center justify-center border-cyan-500/30 relative">
          <div className="w-full flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-cyan-400" /> Biome: {world?.theme || 'Futuristic City'}
            </span>
            <span className="text-xs text-slate-400">
              Structures: {world?.buildings?.length || 0} / {world?.unlockedSlots || 8}
            </span>
          </div>

          <World3DViewer
            world={world}
            selectedBuilding={selectedBuilding}
            onSelectBuilding={(b) => setSelectedBuilding(b)}
            className="h-[480px]"
          />
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            Click on any building to view stats & upgrades. Rotate and zoom camera with mouse.
          </p>
        </GlassCard>

        {/* Right: Structure Details & World Controls */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Building Card */}
          {selectedBuilding ? (
            <GlassCard className="p-5 space-y-4 border-cyan-400/40">
              <div className="flex items-center justify-between">
                <Badge variant="cyan" size="xs">Level {selectedBuilding.level}</Badge>
                <button
                  onClick={() => handleRemoveBuilding(selectedBuilding.buildingId)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
              <h3 className="text-lg font-bold text-white">{selectedBuilding.name}</h3>
              <p className="text-xs text-slate-400">
                Grid Position: ({selectedBuilding.gridX}, {selectedBuilding.gridY})
              </p>
              <Button
                variant="cyan"
                size="md"
                className="w-full"
                icon={ArrowUpCircle}
                onClick={() => handleUpgradeBuilding(selectedBuilding.buildingId)}
              >
                Upgrade to Lv {selectedBuilding.level + 1}
              </Button>
            </GlassCard>
          ) : (
            <GlassCard className="p-6 text-center border-slate-800">
              <p className="text-xs text-slate-400">
                Click a structure on the 3D island to manage upgrades and view stats.
              </p>
            </GlassCard>
          )}

          {/* Theme Switcher */}
          <GlassCard className="p-5 space-y-3 border-slate-800">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Island Biome</p>
            <div className="grid grid-cols-3 gap-2">
              {['futuristic_city', 'space_colony', 'fantasy_island'].map((thm) => (
                <button
                  key={thm}
                  onClick={() => handleThemeChange(thm)}
                  className={`p-2 rounded-xl text-[11px] font-bold capitalize border text-center transition-all ${
                    world?.theme === thm
                      ? 'bg-purple-600/30 border-purple-500 text-white'
                      : 'bg-[#101625] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {thm.replace('_', ' ')}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Place Building Modal */}
      {isPlaceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card bg-[#101625] border border-slate-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Construct New Building</h2>
            {errorMsg && (
              <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20 mb-3">
                {errorMsg}
              </p>
            )}
            <form onSubmit={handlePlaceBuilding} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Building Type</label>
                <select
                  value={buildingType}
                  onChange={(e) => setBuildingType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#080B14] border border-slate-700 text-sm text-white"
                >
                  <option value="productivity_tower">Productivity Tower (Focus Boost)</option>
                  <option value="learning_library">Knowledge Library (Study Boost)</option>
                  <option value="fitness_arena">Titan Arena (Workout Boost)</option>
                  <option value="meditation_garden">Sanctuary Garden (Mental Clarity)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Grid X (0–9)</label>
                  <input
                    type="number"
                    min="0"
                    max="9"
                    value={gridX}
                    onChange={(e) => setGridX(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Grid Y (0–9)</label>
                  <input
                    type="number"
                    min="0"
                    max="9"
                    value={gridY}
                    onChange={(e) => setGridY(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button variant="ghost" onClick={() => setIsPlaceModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="cyan" isLoading={loading}>Place Building</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldPage;
