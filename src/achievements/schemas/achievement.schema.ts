import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type AchievementDocument = HydratedDocument<Achievement>;

@Schema({
  toObject: { virtuals: true, aliases: true, versionKey: false, getters: true },
  toJSON: { virtuals: true, aliases: true, versionKey: false, getters: true },
})
export class Achievement {
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

  @ApiProperty({ example: '10' })
  @Prop()
  condition_max: number;

  @ApiProperty({ example: 'ten_days_strick' })
  @Prop()
  custom_id: string;

  @ApiProperty({ example: 1 })
  @Prop()
  level: number;

  @ApiProperty({ example: true })
  @Prop()
  weight: number;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);
