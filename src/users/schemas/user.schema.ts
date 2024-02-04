import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type UserDocument = HydratedDocument<User>;

@Schema({
  toObject: { virtuals: true, aliases: true, versionKey: false, getters: true },
  toJSON: { virtuals: true, aliases: true, versionKey: false, getters: true },
})
export class User {
  @ApiProperty({ example: '64a26010f0ba3aa7da88810a' })
  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId })
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ example: 'some-mail@mail.com' })
  @Prop()
  email: string;

  @ApiProperty({ example: 'some-password' })
  @Prop()
  password: string;

  @ApiProperty({ example: 'user' })
  @Prop()
  role: string;

  @ApiProperty({ example: 'Alex' })
  @Prop()
  name: string;

  @ApiProperty({ example: 'Smith' })
  @Prop()
  surname: string;

  @ApiProperty({ example: '2023-12-03T09:48:00.000Z' })
  @Prop()
  birth_date: Date;

  @ApiProperty({ example: true })
  @Prop()
  is_active: boolean;

  @ApiProperty({ example: {} })
  @Prop({ type: [Object] })
  survey: object[];

  @ApiProperty({ example: '' })
  @Prop()
  generated_plan: string;

  @ApiProperty({ example: '2023-12-03T09:48:00.000Z' })
  @Prop({ type: Date })
  created_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
