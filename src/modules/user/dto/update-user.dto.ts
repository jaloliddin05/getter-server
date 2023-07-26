import {
  IsString,
  MaxLength,
  IsEmail,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateUserDto {
  @ApiProperty({
    description: `Name`,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  readonly name: string;

  @ApiProperty({
    description: `Email`,
    example: 'johndoe@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(125)
  readonly email: string;

  // @ApiProperty({
  //   description: `Phone number`,
  //   example: '+998998887766',
  // })
  // @IsOptional()
  // @IsString()
  // readonly phone: string;

  // @ApiProperty({
  //   description: `Description`,
  //   example: 'ba.. ba.. ba..',
  // })
  // @IsOptional()
  // @IsString()
  // readonly description: string;

  @ApiProperty({
    description: `role`,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  readonly role: number;

  @ApiProperty({
    description: `Position id`,
    example: '734912fd-e011-4da6-b0a3-031fd82ab2f9',
  })
  @IsOptional()
  @IsString()
  readonly position: string;

  @ApiProperty({
    description: `Article image`,
    example: 'file',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  avatar;
}

export default UpdateUserDto;
