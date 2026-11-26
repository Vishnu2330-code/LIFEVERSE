import crypto from 'crypto';
import { MarketplaceItem, Inventory, Purchase, GamificationProfile } from '../models/index.js';
import { GamificationService } from '../services/gamificationService.js';

export class MarketplaceController {
  static async getCatalog(req, res, next) {
    try {
      const { category, itemType, featured } = req.query;
      const query = { isActive: true };

      if (category && category !== 'all') query.category = category;
      if (itemType && itemType !== 'all') query.itemType = itemType;
      if (featured === 'true') query.isFeatured = true;

      const items = await MarketplaceItem.find(query).sort({ coinCost: 1 });

      const inventory = await Inventory.findOne({ userId: req.user.userId });
      const ownedIds = new Set(inventory?.items?.map((i) => i.itemId) || []);

      const itemsWithOwnership = items.map((item) => ({
        ...item.toObject(),
        isOwned: ownedIds.has(item.itemId),
      }));

      return res.json({ success: true, data: itemsWithOwnership });
    } catch (error) {
      next(error);
    }
  }

  static async purchaseItem(req, res, next) {
    try {
      const { itemId } = req.body;
      const userId = req.user.userId;

      const item = await MarketplaceItem.findOne({ itemId, isActive: true });
      if (!item) {
        return res.status(404).json({ success: false, message: 'Marketplace item not found' });
      }

      // Verify level requirement
      const profile = await GamificationProfile.findOne({ userId });
      if ((profile?.level || 1) < item.levelRequired) {
        return res.status(403).json({
          success: false,
          message: `Level ${item.levelRequired} required to unlock this item.`,
        });
      }

      // Check if already owned
      const inventory = await Inventory.findOne({ userId });
      const alreadyOwned = inventory?.items?.some((i) => i.itemId === item.itemId);
      if (alreadyOwned) {
        return res.status(400).json({
          success: false,
          message: 'You already own this item!',
        });
      }

      // Spend coins atomically
      const txId = `purchase_${item.itemId}_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;
      await GamificationService.spendCoins({
        userId,
        amount: item.coinCost,
        source: 'marketplace_purchase',
        referenceEventId: txId,
      });

      // Add to inventory
      await Inventory.findOneAndUpdate(
        { userId },
        {
          $push: {
            items: {
              itemId: item.itemId,
              itemType: item.itemType,
              acquiredAt: new Date(),
              source: 'marketplace',
            },
          },
        },
        { upsert: true, new: true }
      );

      // Record Purchase receipt
      const purchaseReceipt = await Purchase.create({
        userId,
        itemId: item.itemId,
        itemType: item.itemType,
        coinCost: item.coinCost,
        transactionId: txId,
      });

      return res.status(201).json({
        success: true,
        message: `Purchased "${item.title}" successfully!`,
        data: {
          item,
          receipt: purchaseReceipt,
        },
      });
    } catch (error) {
      if (error.message === 'Insufficient virtual coins') {
        return res.status(400).json({ success: false, message: 'Insufficient virtual coins balance' });
      }
      next(error);
    }
  }
}

export default MarketplaceController;
