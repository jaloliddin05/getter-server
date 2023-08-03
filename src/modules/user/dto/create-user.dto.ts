import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateUserDto {
  @ApiProperty({
    description: `Password`,
    example: 'dsk_45llsd',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  password: string;

  @ApiProperty({
    description: `Name`,
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly name: string;

  @ApiProperty({
    description: `Email`,
    example: 'johndoe@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(125)
  readonly email: string;

  @ApiProperty({
    description: `Position id`,
    example: '734912fd-e011-4da6-b0a3-031fd82ab2f9',
  })
  @IsNotEmpty()
  @IsString()
  readonly position: string;

  @ApiProperty({
    description: `avatar`,
    example: 'url',
  })
  @IsOptional()
  @IsString()
  avatar: string;
}

export default CreateUserDto;
