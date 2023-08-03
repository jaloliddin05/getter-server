import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdatePortfolioDto {
  @ApiProperty({
    description: `title`,
    example: 'Getter',
  })
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: `Creator`,
    example: 'Getter.uz',
  })
  @IsOptional()
  @IsString()
  readonly creator: string;

  @ApiProperty({
    description: `Link of portfolio`,
    example: 'https://getter.uz',
  })
  @IsOptional()
  @IsString()
  readonly link: string;

  @ApiProperty({
    description: `Portfolio image`,
    example: 'url',
  })
  @IsOptional()
  @IsString()
  avatar: string;
}

export default UpdatePortfolioDto;
