import { SelectQueryBuilder } from 'typeorm';
import { BasePaginationResponse, IBasePaginationRequest } from './common.type';
import { plainToInstance } from 'class-transformer';

export async function formatPaginate<T = any>(
  query: SelectQueryBuilder<any>,
  pagination: IBasePaginationRequest,
  outputDto?: new () => T,
  isRaw = false,
) {
  const limit = Math.min(pagination?.size || 10, 100);
  const page = pagination?.page || 1;
  const offset = (page - 1) * limit;

  const countQuery = query.clone();

  query.limit(limit).offset(offset);

  // eslint-disable-next-line prefer-const
  let [data, total] = await Promise.all([
    isRaw ? query.getRawMany() : query.getMany(),
    countQuery.getCount(),
  ]);

  if (outputDto) {
    data = data.map((e) =>
      plainToInstance(outputDto, e, { ignoreDecorators: !isRaw }),
    );
  }

  const result = new BasePaginationResponse<T>();
  result.data = data as T[];
  result.total = total;
  result.page = page;
  result.size = limit;

  return result;
}
