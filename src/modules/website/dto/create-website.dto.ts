import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class CreateWebsiteDto {
  @ApiProperty({
    description: `name`,
    example: 'Kaneki Ken',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: `phone`,
    example: '+998998887766',
  })
  @IsNotEmpty()
  @IsString()
  readonly phone: string;

  @ApiProperty({
    description: `Link of website`,
    example: 'https://getter.uz',
  })
  @IsNotEmpty()
  @IsString()
  readonly link: string;

  @ApiProperty({
    description: `title`,
    example: 'Site Website',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `creator`,
    example: 'Getter uz',
  })
  @IsNotEmpty()
  @IsString()
  readonly creator: string;
}

export default CreateWebsiteDto;
