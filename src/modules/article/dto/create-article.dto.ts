import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  isArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

function parseTextToArray(name: string, value?: string) {
  const arr = value ? JSON.parse(value) : '';
  if (!isArray(arr)) {
    throw new BadRequestException(`${name} should be array.`);
  }
  return arr;
}

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
    description: `avatar`,
    example: [
      {
        url: 'url',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }: { value: string }) =>
    parseTextToArray('avatar', value),
  )
  avatar;
}

export default CreateArticleDto;
