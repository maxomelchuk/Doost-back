import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Achievement, AchievementDocument } from './schemas/achievement.schema';
import { AchievementCategory } from './schemas/achievement-category.schema.';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectModel(Achievement.name)
    private achievementModel: Model<AchievementDocument>,
    @InjectModel(AchievementCategory.name)
    private achievementCategoryModel: Model<AchievementCategory>,
  ) {}

  async getAllAchievements() {
    const achievement = await this.achievementModel
      .find()
      .populate('category_id');
    return achievement;
  }

  async createAchievement(dto: any) {
    const achievement = await new this.achievementModel({
      ...dto,
      category_id: new mongoose.Types.ObjectId(dto.category_id),
      start_date: new Date(dto.start_date),
      _id: new mongoose.Types.ObjectId(),
    });
    await achievement.save();
    return achievement;
  }

  async createCategory(dto: any) {
    const achievementCategory = await new this.achievementCategoryModel({
      ...dto,
      _id: new mongoose.Types.ObjectId(),
    });
    await achievementCategory.save();
    return achievementCategory;
  }
}
