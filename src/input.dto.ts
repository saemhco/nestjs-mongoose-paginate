import { Transform, TransformFnParams, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, Min } from 'class-validator';

export type SortableParameters = Record<string, 'desc' | 'asc'>;
export type FilterableParameters = Record<string, unknown>;

export class CounterDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Filter query string, see documentation for its schema',
  })
  @Transform((v: TransformFnParams) => filterQueryToObject(v.value))
  @IsObject()
  readonly filter?: FilterableParameters;
}

export class CollectionDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Filter query string, see documentation for its schema: https://www.npmjs.com/package/@saemhco/nestjs-mongoose-paginate',
  })
  @Transform((v: TransformFnParams) => filterQueryToObject(v.value))
  @IsOptional()
  @IsObject()
  readonly filter?: FilterableParameters;

  @ApiPropertyOptional({
    example: '-createdAt',
    description:
      'Use only allowed properties separated by semicolon; default is ascending created_at; prefix name with hyphen/minus sign to get descending order',
    type: String,
  })
  @IsOptional()
  @IsString()
  readonly sort?: string;

  readonly sorter?: SortableParameters;

  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ example: 0, description: '' })
  readonly page?: number = 0;

  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ example: 10, description: '' })
  readonly limit?: number = 10;
}

function filterQueryToObject(v: string) {
  if (typeof v === 'string') v = JSON.parse(v);
  return v;
}
