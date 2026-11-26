import crypto from 'crypto';
import { VirtualWorld, Building, Inventory } from '../models/index.js';

export class WorldController {
  static async getWorld(req, res, next) {
    try {
      let world = await VirtualWorld.findOne({ userId: req.user.userId });
      if (!world) {
        world = await VirtualWorld.create({
          userId: req.user.userId,
          theme: 'futuristic_city',
          buildings: [
            {
              buildingId: 'starter_hut',
              buildingType: 'learning_library',
              name: 'Starter Library',
              gridX: 4,
              gridY: 4,
              rotation: 0,
              level: 1,
              assetRef: 'learning_library_lv1',
            },
          ],
        });
      }
      return res.json({ success: true, data: world });
    } catch (error) {
      next(error);
    }
  }

  static async updateTheme(req, res, next) {
    try {
      const { theme } = req.body;
      const world = await VirtualWorld.findOne({ userId: req.user.userId });
      if (!world) return res.status(404).json({ success: false, message: 'World not found' });

      world.theme = theme;
      await world.save();

      return res.json({ success: true, message: 'World theme updated', data: world });
    } catch (error) {
      next(error);
    }
  }

  static async placeBuilding(req, res, next) {
    try {
      const { buildingType, name, gridX, gridY, rotation = 0 } = req.body;
      const world = await VirtualWorld.findOne({ userId: req.user.userId });
      if (!world) return res.status(404).json({ success: false, message: 'World not found' });

      // Check grid boundaries
      if (gridX < 0 || gridX >= world.gridWidth || gridY < 0 || gridY >= world.gridHeight) {
        return res.status(400).json({ success: false, message: 'Coordinates are out of grid bounds' });
      }

      // Check collision with existing building
      const collision = world.buildings.some((b) => b.gridX === gridX && b.gridY === gridY);
      if (collision) {
        return res.status(409).json({ success: false, message: 'A building already occupies this slot' });
      }

      // Check slot limits
      if (world.buildings.length >= world.unlockedSlots) {
        return res.status(400).json({
          success: false,
          message: 'All available world construction slots are currently occupied. Level up to expand land!',
        });
      }

      const buildingTemplate = await Building.findOne({ buildingType });
      const assetRef = buildingTemplate?.assetRef || `${buildingType}_lv1`;

      const newBuilding = {
        buildingId: `bldg_${Date.now()}_${crypto.randomUUID().slice(0, 6)}`,
        buildingType,
        name: name || buildingTemplate?.name || 'New Structure',
        gridX,
        gridY,
        rotation,
        level: 1,
        assetRef,
      };

      world.buildings.push(newBuilding);
      await world.save();

      return res.status(201).json({
        success: true,
        message: 'Building placed successfully!',
        data: world,
      });
    } catch (error) {
      next(error);
    }
  }

  static async upgradeBuilding(req, res, next) {
    try {
      const { buildingId } = req.params;
      const world = await VirtualWorld.findOne({ userId: req.user.userId });
      if (!world) return res.status(404).json({ success: false, message: 'World not found' });

      const building = world.buildings.find((b) => b.buildingId === buildingId);
      if (!building) return res.status(404).json({ success: false, message: 'Building not found' });

      building.level += 1;
      building.assetRef = `${building.buildingType}_lv${building.level}`;
      await world.save();

      return res.json({
        success: true,
        message: 'Building upgraded!',
        data: world,
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeBuilding(req, res, next) {
    try {
      const { buildingId } = req.params;
      const world = await VirtualWorld.findOne({ userId: req.user.userId });
      if (!world) return res.status(404).json({ success: false, message: 'World not found' });

      world.buildings = world.buildings.filter((b) => b.buildingId !== buildingId);
      await world.save();

      return res.json({
        success: true,
        message: 'Building removed',
        data: world,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default WorldController;
