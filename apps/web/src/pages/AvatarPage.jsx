import React, { useState, useEffect } from 'react';
import { User, Sparkles, Check, Lock, Save, Shield } from 'lucide-react';
import apiClient from '../services/api.js';
import Avatar3DPreview from '../components/three/Avatar3DPreview.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';

export const AvatarPage = () => {
  const [avatar, setAvatar] = useState(null);
  const [availableItems, setAvailableItems] = useState([]);
  const [activeTab, setActiveTab] = useState('outfit'); // 'outfit' | 'armor' | 'accessories' | 'effects' | 'appearance'
  const [skinTone, setSkinTone] = useState('#d1a384');
  const [hairColor, setHairColor] = useState('#8B5CF6');
  const [equippedItems, setEquippedItems] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadAvatarData();
  }, []);

  const loadAvatarData = async () => {
    try {
      const [avatarRes, itemsRes] = await Promise.all([
        apiClient.get('/avatar'),
        apiClient.get('/avatar/items'),
      ]);
      if (avatarRes.data) {
        setAvatar(avatarRes.data);
        setSkinTone(avatarRes.data.skinTone || '#d1a384');
        setEquippedItems(avatarRes.data.equippedItems || {});
        if (avatarRes.data.equippedItems?.hairColor) {
          setHairColor(avatarRes.data.equippedItems.hairColor);
        }
      }
      if (itemsRes.data) setAvailableItems(itemsRes.data);
    } catch (err) {
      console.error('Error loading avatar:', err);
    }
  };

  const handleEquip = (category, itemId) => {
    setEquippedItems((prev) => ({
      ...prev,
      [category]: prev[category] === itemId ? 'none' : itemId,
    }));
  };

  const handleSaveAvatar = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await apiClient.patch('/avatar/equip', {
        skinTone,
        equippedItems: {
          ...equippedItems,
          hairColor,
        },
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save avatar:', err);
    } finally {
      setSaving(false);
    }
  };

  const skinColors = ['#d1a384', '#e0ac69', '#ffdbac', '#8d5524', '#c68642', '#3c2005'];
  const hairColors = ['#8B5CF6', '#22D3EE', '#FBBF24', '#EF4444', '#1E293B', '#F8FAFC'];

  const filteredItems = availableItems.filter((i) => {
    if (activeTab === 'outfit') return i.category === 'outfit' || i.category === 'shoes';
    if (activeTab === 'armor') return i.category === 'armor';
    if (activeTab === 'accessories') return i.category === 'accessories';
    if (activeTab === 'effects') return i.category === 'effects';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white font-heading">Avatar Customizer</h1>
          <p className="text-xs text-slate-400 mt-1">
            Customize your 3D adventurer with earned achievements and marketplace items
          </p>
        </div>
        <Button
          variant="primary"
          icon={Save}
          isLoading={saving}
          onClick={handleSaveAvatar}
        >
          {saveSuccess ? 'Saved!' : 'Save Avatar'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 3D Preview Canvas */}
        <GlassCard className="lg:col-span-5 p-6 flex flex-col items-center justify-center border-purple-500/25 relative">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">3D Preview</span>
            <Badge variant="cyan" size="xs">Live View</Badge>
          </div>
          <Avatar3DPreview
            equippedItems={{ ...equippedItems, hairColor }}
            skinTone={skinTone}
            className="h-[420px]"
          />
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            Click and drag to rotate character. Scroll to zoom.
          </p>
        </GlassCard>

        {/* Right: Customization Wardrobe */}
        <div className="lg:col-span-7 space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#171E30] border border-slate-700/60 overflow-x-auto">
            {['outfit', 'armor', 'accessories', 'effects', 'appearance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Color Selectors for Appearance */}
          {activeTab === 'appearance' ? (
            <GlassCard className="p-6 space-y-6 border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-3">Skin Tone</label>
                <div className="flex items-center gap-3">
                  {skinColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSkinTone(color)}
                      className={`w-9 h-9 rounded-full border-2 transition-transform ${
                        skinTone === color ? 'border-cyan-400 scale-110 shadow-lg' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-3">Cyber Hair Color</label>
                <div className="flex items-center gap-3">
                  {hairColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setHairColor(color)}
                      className={`w-9 h-9 rounded-full border-2 transition-transform ${
                        hairColor === color ? 'border-cyan-400 scale-110 shadow-lg' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </GlassCard>
          ) : (
            /* Items Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const isEquipped = equippedItems[item.category] === item.itemId;
                return (
                  <GlassCard
                    key={item.itemId}
                    hoverEffect={item.isOwned}
                    onClick={() => item.isOwned && handleEquip(item.category, item.itemId)}
                    className={`p-4 border transition-all ${
                      isEquipped
                        ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                        : item.isOwned
                        ? 'border-slate-800'
                        : 'border-slate-800/40 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-white text-sm">{item.name}</h4>
                        <p className="text-xs text-slate-400">{item.description}</p>
                      </div>

                      {isEquipped ? (
                        <span className="p-1.5 rounded-lg bg-cyan-400 text-slate-900">
                          <Check className="w-4 h-4" />
                        </span>
                      ) : !item.isOwned ? (
                        <span className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
                          <Lock className="w-4 h-4" />
                        </span>
                      ) : null}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarPage;
