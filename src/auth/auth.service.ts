import { Injectable, Dependencies } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { USER_BODY } from 'src/users/dto/users.dto';
import * as bcrypt from 'bcrypt';
import { AUTH_BODY } from './auth.dto';
import { ERRORS } from 'src/common/errors';

@Dependencies(UsersService, JwtService)
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: AUTH_BODY.Login) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async signup(userDto: USER_BODY.Create) {
    await this.usersService.checkIsUserExist(userDto.email);
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }

  async generateToken(user) {
    const payload = { email: user.email, _id: user._id, role: user.role };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(userDto: AUTH_BODY.Login) {
    const user = await this.usersService.getUserByEmail(userDto.email, true);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    }
    throw ERRORS.INVALID_PASSWORD;
  }
}
