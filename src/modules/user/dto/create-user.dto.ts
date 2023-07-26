import { IsNotEmpty, IsString, MaxLength, IsEmail } from 'class-validator';
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

  // @ApiProperty({
  //   description: `Phone number`,
  //   example: '+998998887766',
  // })
  // @IsNotEmpty()
  // @IsString()
  // readonly phone: string;

  // @ApiProperty({
  //   description: `Description `,
  //   example: 'I why fly ...',
  // })
  // @IsNotEmpty()
  // @IsString()
  // readonly description: string;

  @ApiProperty({
    description: `Position id`,
    example: '734912fd-e011-4da6-b0a3-031fd82ab2f9',
  })
  @IsNotEmpty()
  @IsString()
  readonly position: string;

  @ApiProperty({
    description: `Article image`,
    example: 'file',
    type: 'string',
    format: 'binary',
  })
  avatar;
}

export default CreateUserDto;
