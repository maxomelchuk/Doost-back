import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type AchievementCategoryDocument = HydratedDocument<AchievementCategory>;

@Schema({
  collection: 'achievements_categories',
  toObject: { virtuals: true, aliases: true, versionKey: false, getters: true },
  toJSON: { virtuals: true, aliases: true, versionKey: false, getters: true },
})
export class AchievementCategory {
  @ApiProperty({ example: '64a26010f0ba3aa7da88810a' })
  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId })
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ example: 'ten_days_strick' })
  @Prop()
  custom_id: string;

  @ApiProperty({ example: '2023-12-03T09:48:00.000Z' })
  @Prop()
  start_date: Date;

  @ApiProperty({ example: true })
  @Prop()
  weight: number;
}

export const AchievementCategorySchema =
  SchemaFactory.createForClass(AchievementCategory);
