import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { USER_BODY, USER_RESPONSE } from './dto/users.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { ROLES } from 'src/auth/roles';
import { SuccessResponse } from 'src/common/dto';
import { DELETE_TYPE } from 'src/common/constants';

@ApiTags('Users')
@Controller('api')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(ROLES.USER, ROLES.ADMIN, ROLES.DEVELOPER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [USER_RESPONSE.User],
  })
  @Get('/users')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Roles(ROLES.USER, ROLES.ADMIN, ROLES.DEVELOPER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get user info' })
  @ApiResponse({
    status: 200,
    description: 'User info',
    type: USER_RESPONSE.User,
  })
  @Get('/users/:id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Roles(ROLES.USER, ROLES.ADMIN, ROLES.DEVELOPER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update user' })
  @ApiBody({
    type: USER_BODY.Update,
  })
  @ApiResponse({
    status: 201,
    description: 'Update user',
    type: SuccessResponse,
  })
  @Put('/users/:id')
  updateUser(@Param('id') id: string, @Body() userDto: USER_BODY.Update) {
    return this.usersService.updateUser(id, userDto);
  }

  @Roles(ROLES.USER, ROLES.ADMIN, ROLES.DEVELOPER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 201,
    description: 'Delete user',
    type: SuccessResponse,
  })
  @Delete('/users/:id')
  deleteUser(@Param('id') id: string, @Query('type') type: DELETE_TYPE) {
    return this.usersService.deleteUser(id, type);
  }

  // make achievements for user
  @Get('/test/:id')
  async test(@Param('id') id: string) {
    return await this.usersService.test(id);
  }
}
