import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ROLES } from 'src/auth/roles';
import { successResponse } from 'src/common/functions';
import { ERRORS } from 'src/common/errors';
import * as bcrypt from 'bcrypt';
import { USER_BODY, USER_DTO } from './dto/users.dto';
import { DELETE_TYPE } from 'src/common/constants';
import configuration, { getMongoConnectURL } from 'config/configuration';
import OpenAI from 'openai';
import {
  UserAchievement,
  UserAchievementDocument,
} from './schemas/user-achievement.schema';
import { AchievementCategory } from 'src/achievements/schemas/achievement-category.schema.';
import {
  Achievement,
  AchievementDocument,
} from 'src/achievements/schemas/achievement.schema';
const config = configuration();
const openai = new OpenAI({
  apiKey: config[process.env.ENV].chatGPT.apiKey,
});

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(UserAchievement.name)
    private userAchievementModel: Model<UserAchievementDocument>,
    @InjectModel(Achievement.name)
    private achievementModel: Model<AchievementDocument>,
    @InjectModel(AchievementCategory.name)
    private achievementCategoryModel: Model<AchievementCategory>,
  ) {}

  async createUser(dto: USER_BODY.Create) {
    const dataToInsert = {
      ...dto,
      role: ROLES.USER,
      created_at: new Date(),
      _id: new mongoose.Types.ObjectId(),
    };
    if (dto.survey) {
      const question = await this.makeQuestionForGPT(dto.survey);
      dataToInsert['generated_plan'] = question;
    }
    const user = await new this.userModel(dataToInsert);
    await user.save();
    return user;
  }

  async getAllUsers() {
    const users = await this.userModel.find({}, { password: 0 });

    return users.map((user) => {
      return {
        _id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.created_at,
      };
    });
  }

  async getUserByEmail(email: string, password?: boolean): Promise<any> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) throw ERRORS.USER_DOES_NOT_EXIST;
    const data = {
      _id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at,
    };
    if (password) {
      data['password'] = user.password;
    }
    return data;
  }

  async checkIsUserExist(email: string) {
    const user = await this.userModel.findOne({ email: email });
    if (user) throw ERRORS.USER_WITH_THIS_EMAIL_ALREADY_EXISTS;
    return user;
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw ERRORS.USER_DOES_NOT_EXIST;
    const userAchievements = await this.userAchievementModel
      .find({
        user_id: user._id,
      })
      .populate('achievement_id')
      .populate('category_id');
    const sortByCategory = {};
    userAchievements.forEach((el: any) => {
      if (!sortByCategory[el.category_id.custom_id.toString()]) {
        sortByCategory[el.category_id.custom_id.toString()] = [];
      }
      sortByCategory[el.category_id.custom_id.toString()].push({
        conditionMax: el.condition_max,
        currentValue: el.current_value,
        level: el.achievement_id.level,
        customId: el.achievement_id.custom_id,
      });
    });
    let result = [];
    for (let key in sortByCategory) {
      result.push({
        category: key,
        achievements: sortByCategory[key].sort((a, b) => a.level - b.level),
      });
    }
    const data = {
      _id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at,
      generatedPlan: user.generated_plan,
      achievements: result,
    };

    return data;
  }

  async updateUser(id: string, dto: USER_BODY.Update) {
    const user = await this.userModel.findById(id);
    const dataToUpdate = {};
    if (dto.name !== undefined) dataToUpdate['name'] = dto.name;
    if (dto.surname !== undefined) dataToUpdate['surname'] = dto.surname;
    if (dto.birthDate !== undefined)
      dataToUpdate['birth_date'] = new Date(dto.birthDate);
    if (dto.email !== undefined && user.email !== dto.email) {
      const userByEmail = await this.userModel.findOne({ email: dto.email });
      if (userByEmail && userByEmail._id.toString() !== id)
        throw ERRORS.USER_WITH_THIS_EMAIL_ALREADY_EXISTS;

      dataToUpdate['email'] = dto.email;
    }
    if (dto.newPassword !== undefined) {
      //  if(dto.newPassword !== undefined && dto.newPassword !== dto.password){
      //   const isEqual = await bcrypt.compare(user.password, dto.password);
      //   if (!isEqual) throw ERRORS.INVALID_PASSWORD;
      // }

      dataToUpdate['password'] = bcrypt.hash(dto.newPassword, 5);
    }

    await this.userModel.updateOne({ _id: user._id }, { $set: dataToUpdate });
    return successResponse(true);
  }

  async deleteUser(id: string, type: DELETE_TYPE) {
    const user = await this.userModel.findById(id);
    switch (type) {
      case DELETE_TYPE.SOFT:
        await this.userModel.updateOne(
          { _id: user._id },
          { $set: { is_active: false, remove_date: new Date() } },
        );
        break;
      case DELETE_TYPE.HARD:
        await this.userModel.deleteOne({ _id: user._id });
        break;
    }
  }

  async makeQuestionForGPT(survey: any) {
    let string = '';
    for (let item of survey) {
      string += `${item.question} ${item.answer}. `;
    }
    const question = `There is a survey of a person - ${string}. Give him a personalized weed fasting plan.`;
    const result = await openai.chat.completions.create({
      messages: [{ role: 'user', content: question }],
      model: 'gpt-3.5-turbo',
    });
    return result.choices[0].message.content;
  }

  // make achievements for user
  async test(id: string) {
    let category = await this.achievementCategoryModel.findOne();
    let achievements = await this.achievementModel.find({
      category_id: category._id,
    });

    let data = [];
    achievements.forEach(async (el) => {
      data.push({
        _id: new mongoose.Types.ObjectId(),
        achievement_id: el._id,
        category_id: category._id,
        client_received_at: new Date(),
        condition_max: el.condition_max,
        current_value: el.condition_max,
        user_id: new mongoose.Types.ObjectId(id),
      });
    });
    await this.userAchievementModel.insertMany(data);
    return 'ff';
  }
}
