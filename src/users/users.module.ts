import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import {
  Achievement,
  AchievementSchema,
} from 'src/achievements/schemas/achievement.schema';
import {
  AchievementCategory,
  AchievementCategorySchema,
} from 'src/achievements/schemas/achievement-category.schema.';
import {
  UserAchievement,
  UserAchievementSchema,
} from './schemas/user-achievement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Achievement.name, schema: AchievementSchema },
      { name: AchievementCategory.name, schema: AchievementCategorySchema },
      { name: UserAchievement.name, schema: UserAchievementSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
