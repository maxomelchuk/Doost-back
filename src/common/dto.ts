import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse {
  @ApiProperty({})
  data: boolean;
}
