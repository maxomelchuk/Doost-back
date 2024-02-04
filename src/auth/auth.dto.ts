import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
export namespace AUTH_BODY {
  export class Login {
    @ApiProperty({ example: 'some-mail@mail.com', required: true })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'some-password', required: true })
    @MaxLength(16)
    @MinLength(4)
    password: string;
  }
}

export namespace AUTH_RESPONSE {
  export class Token {
    @ApiProperty()
    token: string;
  }
}
