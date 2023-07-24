import { IsArray, IsOptional, IsString, isArray } from 'class-validator';
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

class UpdateArticleDto {
  @ApiProperty({
    description: `title`,
    example: 'Design',
  })
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `Description`,
    example: 'Design is ..., because ......, but .... ',
  })
  @IsOptional()
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: `Category ID`,
    example: [
      '734912fd-e011-4da6-b0a3-031fd82ab2f9',
      '734912fd-e011-4da6-b0a3-031fd82ab2f9',
    ],
  })
  @Transform(({ value }: { value: string }) =>
    parseTextToArray('categories', value),
  )
  @IsOptional()
  @IsString()
  readonly category: string[];

  @ApiProperty({
    description: `User ID`,
    example: '734912fd-e011-4da6-b0a3-031fd82ab2f9',
  })
  @IsOptional()
  @IsString()
  readonly user: string;
}

export default UpdateArticleDto;
