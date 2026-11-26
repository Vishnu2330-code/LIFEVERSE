import { Avatar, AvatarItem, Inventory } from '../models/index.js';

export class AvatarController {
  static async getAvatar(req, res, next) {
    try {
      let avatar = await Avatar.findOne({ userId: req.user.userId });
      if (!avatar) {
        avatar = await Avatar.create({ userId: req.user.userId });
      }
      return res.json({ success: true, data: avatar });
    } catch (error) {
      next(error);
    }
  }

  static async updateEquipped(req, res, next) {
    try {
      const { equippedItems, gender, skinTone } = req.body;
      const avatar = await Avatar.findOne({ userId: req.user.userId });
      if (!avatar) return res.status(404).json({ success: false, message: 'Avatar not found' });

      if (gender) avatar.gender = gender;
      if (skinTone) avatar.skinTone = skinTone;

      if (equippedItems) {
        // Validate user owns the items (or item is default/none)
        const inventory = await Inventory.findOne({ userId: req.user.userId });
        const ownedItemIds = new Set(inventory?.items?.map((i) => i.itemId) || []);

        for (const [category, itemId] of Object.entries(equippedItems)) {
          if (itemId && itemId !== 'none' && !itemId.startsWith('default_')) {
            const isOwned = ownedItemIds.has(itemId);
            const isPublicDefault = await AvatarItem.findOne({ itemId, isDefault: true });
            if (!isOwned && !isPublicDefault) {
              return res.status(403).json({
                success: false,
                message: `You do not own item ${itemId} to equip it.`,
              });
            }
          }
          avatar.equippedItems[category] = itemId;
        }
      }

      await avatar.save();

      return res.json({
        success: true,
        message: 'Avatar customization saved!',
        data: avatar,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAvailableItems(req, res, next) {
    try {
      const [items, inventory] = await Promise.all([
        AvatarItem.find({}),
        Inventory.findOne({ userId: req.user.userId }),
      ]);

      const ownedItemIds = new Set(inventory?.items?.map((i) => i.itemId) || []);

      const itemsWithOwnership = items.map((item) => ({
        ...item.toObject(),
        isOwned: item.isDefault || ownedItemIds.has(item.itemId),
      }));

      return res.json({
        success: true,
        data: itemsWithOwnership,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AvatarController;
