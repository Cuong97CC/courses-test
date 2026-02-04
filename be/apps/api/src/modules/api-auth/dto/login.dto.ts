import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoginDto {
  @ApiProperty({ example: 'student1@example.com' })
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  password: string;
}
