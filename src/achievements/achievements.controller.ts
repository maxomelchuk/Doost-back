import { Body, Controller, Get, Post } from '@nestjs/common';
import { AchievementsService } from './achievements.service';

@Controller('/api')
export class AchievementsController {
  constructor(private achievementsService: AchievementsService) {}

  @Get('/achievements')
  getAllUsers() {
    return this.achievementsService.getAllAchievements();
  }

  @Post('/achievements')
  createAchievement(@Body() dto: any) {
    return this.achievementsService.createAchievement(dto);
  }

  @Post('/achievements/category')
  createCategory(@Body() dto: any) {
    return this.achievementsService.createCategory(dto);
  }
}
