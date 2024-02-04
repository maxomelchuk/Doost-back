import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { USER_BODY } from 'src/users/dto/users.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AUTH_RESPONSE, AUTH_BODY } from './auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiBody({
    type: AUTH_BODY.Login,
  })
  @ApiResponse({
    status: 201,
    description: 'Login',
    type: AUTH_RESPONSE.Token,
  })
  @Post('/login')
  login(@Body() userDto: AUTH_BODY.Login) {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: 'Signup' })
  @ApiBody({
    type: USER_BODY.Create,
  })
  @ApiResponse({
    status: 201,
    description: 'Signup',
    type: AUTH_RESPONSE.Token,
  })
  @Post('/signup')
  signup(@Body() userDto: USER_BODY.Create) {
    return this.authService.signup(userDto);
  }
}
