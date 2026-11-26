import { Inventory, AvatarItem, Building, MarketplaceItem } from '../models/index.js';

export class InventoryController {
  static async getInventory(req, res, next) {
    try {
      let inventory = await Inventory.findOne({ userId: req.user.userId });
      if (!inventory) {
        inventory = await Inventory.create({ userId: req.user.userId, items: [] });
      }

      // Enrich with metadata
      const avatarItems = await AvatarItem.find({});
      const itemMap = new Map(avatarItems.map((ai) => [ai.itemId, ai]));

      const enriched = inventory.items.map((item) => {
        const meta = itemMap.get(item.itemId);
        return {
          ...item.toObject(),
          name: meta?.name || item.itemId,
          category: meta?.category || 'general',
          rarity: meta?.rarity || 'common',
          assetRef: meta?.assetRef || null,
        };
      });

      return res.json({
        success: true,
        data: enriched,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default InventoryController;
