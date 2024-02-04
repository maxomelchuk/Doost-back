import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Achievement } from 'src/achievements/schemas/achievement.schema';
export type UserAchievementDocument = HydratedDocument<UserAchievement>;

@Schema({
  collection: 'user_achievements',
  toObject: { virtuals: true, aliases: true, versionKey: false, getters: true },
  toJSON: { virtuals: true, aliases: true, versionKey: false, getters: true },
})
export class UserAchievement {
  @ApiProperty({ example: '64a26010f0ba3aa7da88810a' })
  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId })
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ example: 'some-mail@mail.com' })
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AchievementCategory',
  })
  category_id: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ example: 'some-mail@mail.com' })
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement',
  })
  achievement_id: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ example: '10' })
  @Prop()
  condition_max: number;

  @ApiProperty({ example: '10' })
  @Prop()
  current_value: number;

  @ApiProperty({ example: '2023-12-03T09:48:00.000Z' })
  @Prop()
  client_received_at: Date;

  @ApiProperty({ example: '64a26010f0ba3aa7da88810a' })
  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId })
  user_id: mongoose.Schema.Types.ObjectId;
}

export const UserAchievementSchema =
  SchemaFactory.createForClass(UserAchievement);
