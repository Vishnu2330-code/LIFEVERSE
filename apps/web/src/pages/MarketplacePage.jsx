import React, { useState, useEffect } from 'react';
import { ShoppingBag, Coins, Check, Lock, Sparkles, Filter } from 'lucide-react';
import apiClient from '../services/api.js';
import { useGamificationStore } from '../store/useGamificationStore.js';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';

export const MarketplacePage = () => {
  const [items, setItems] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [purchasingId, setPurchasingId] = useState(null);
  const [purchaseError, setPurchaseError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState('');
  const { profile, fetchProfile } = useGamificationStore();

  useEffect(() => {
    loadMarketplace();
  }, [filterCategory]);

  const loadMarketplace = async () => {
    try {
      const params = filterCategory !== 'all' ? `?category=${filterCategory}` : '';
      const res = await apiClient.get(`/marketplace${params}`);
      if (res.data) setItems(res.data);
    } catch (err) {
      console.error('Failed to load marketplace:', err);
    }
  };

  const handlePurchase = async (itemId) => {
    setPurchasingId(itemId);
    setPurchaseError('');
    setPurchaseSuccess('');
    try {
      const res = await apiClient.post('/marketplace/purchase', { itemId });
      setPurchaseSuccess(res.message || 'Purchased successfully!');
      fetchProfile();
      loadMarketplace();
      setTimeout(() => setPurchaseSuccess(''), 4000);
    } catch (err) {
      setPurchaseError(err.message || 'Purchase failed.');
      setTimeout(() => setPurchaseError(''), 4000);
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Header & Coins Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white font-heading">Virtual Marketplace</h1>
          <p className="text-xs text-slate-400 mt-1">
            Exchange your earned virtual coins for gear, architectural blueprints, and themes
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
          <Coins className="w-5 h-5 text-amber-400" />
          <span>{profile?.coins || 0} Coins</span>
        </div>
      </div>

      {purchaseSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          {purchaseSuccess}
        </div>
      )}

      {purchaseError && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
          {purchaseError}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#171E30] border border-slate-700/60 overflow-x-auto">
        {[
          { id: 'all', label: 'All Catalog' },
          { id: 'avatar_outfit', label: 'Outfits & Armor' },
          { id: 'avatar_accessory', label: 'Accessories' },
          { id: 'visual_effect', label: 'Visual Effects' },
          { id: 'building', label: 'Building Blueprints' },
          { id: 'world_theme', label: 'World Themes' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filterCategory === tab.id
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <GlassCard key={item.itemId} hoverEffect className="p-5 flex flex-col justify-between border-slate-800">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="purple" size="xs">{item.category}</Badge>
                {item.levelRequired > 1 && (
                  <Badge variant="cyan" size="xs">Requires Lv {item.levelRequired}</Badge>
                )}
              </div>

              <div className="h-28 rounded-2xl bg-[#080B14] flex items-center justify-center text-slate-500 border border-slate-800">
                <Sparkles className="w-10 h-10 text-purple-400/60 animate-pulse" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{item.description}</p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                {item.coinCost} Coins
              </span>

              {item.isOwned ? (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  Owned
                </span>
              ) : (
                <Button
                  size="sm"
                  variant="gold"
                  isLoading={purchasingId === item.itemId}
                  onClick={() => handlePurchase(item.itemId)}
                >
                  Acquire
                </Button>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default MarketplacePage;
