import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class UpdateWebsiteDto {
  @ApiProperty({
    description: `name`,
    example: 'Kaneki Ken',
  })
  @IsOptional()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: `phone`,
    example: '+998998887766',
  })
  @IsOptional()
  @IsString()
  readonly phone: string;

  @ApiProperty({
    description: `Link of website`,
    example: 'https://getter.uz',
  })
  @IsOptional()
  @IsString()
  readonly link: string;

  @ApiProperty({
    description: `avatar`,
    example: 'url',
  })
  @IsOptional()
  @IsString()
  avatar: string;

  @ApiProperty({
    description: `title`,
    example: 'Site Website',
  })
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `creator`,
    example: 'Getter uz',
  })
  @IsOptional()
  @IsString()
  readonly creator: string;
}

export default UpdateWebsiteDto;
