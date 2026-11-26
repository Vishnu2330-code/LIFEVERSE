import React, { useState, useEffect } from 'react';
import { Package, Sparkles } from 'lucide-react';
import apiClient from '../services/api.js';
import GlassCard from '../components/common/GlassCard.jsx';
import Badge from '../components/common/Badge.jsx';

export const InventoryPage = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const res = await apiClient.get('/inventory');
      if (res.data) setInventoryItems(res.data);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      <div>
        <h1 className="text-3xl font-black text-white font-heading">Inventory & Vault</h1>
        <p className="text-xs text-slate-400 mt-1">Review all acquired equipment, blueprints, and thematic artifacts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {inventoryItems.map((item, idx) => (
          <GlassCard key={idx} hoverEffect className="p-4 space-y-3 border-slate-800">
            <div className="flex items-center justify-between">
              <Badge variant="purple" size="xs">{item.itemType}</Badge>
              <span className="text-[10px] text-slate-400 font-semibold">{item.source}</span>
            </div>

            <div className="h-20 rounded-xl bg-[#080B14] flex items-center justify-center text-slate-600 border border-slate-800">
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </div>

            <div>
              <h3 className="font-bold text-sm text-white">{item.name || item.itemId}</h3>
              <p className="text-[11px] text-slate-400">
                Acquired: {new Date(item.acquiredAt).toLocaleDateString()}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;
