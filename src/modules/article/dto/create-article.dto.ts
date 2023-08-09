import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateArticleDto {
  @ApiProperty({
    description: `title`,
    example: 'Design',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `Description`,
    example: 'Design is ..., because ......, but .... ',
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: `Tags`,
    example: ['uuid', 'uuid', 'uuid'],
  })
  @IsNotEmpty()
  @IsArray()
  readonly tags: string[];

  @ApiProperty({
    description: `Category ID`,
    example: [
      '734912fd-e011-4da6-b0a3-031fd82ab2f9',
      '734912fd-e011-4da6-b0a3-031fd82ab2f9',
    ],
  })
  @IsNotEmpty()
  @IsArray()
  readonly categories: string[];

  @ApiProperty({
    description: `desc imgs`,
    example: ['url', 'url'],
  })
  @IsOptional()
  @IsArray()
  readonly descImgs: string[];

  @ApiProperty({
    description: `avatar`,
    example: [
      {
        url: 'url',
        border: '',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  avatar;
}

export default CreateArticleDto;
