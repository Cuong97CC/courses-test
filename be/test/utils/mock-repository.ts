import { Repository } from 'typeorm';

/**
 * Creates a mock TypeORM repository with all common methods
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MockRepository<T = any> = Partial<Repository<T>> & {
  create: jest.Mock;
  save: jest.Mock;
  find: jest.Mock;
  findOne: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  createQueryBuilder: jest.Mock;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getOne: jest.fn(),
    getRawMany: jest.fn(),
    getRawOne: jest.fn(),
    getCount: jest.fn(),
    clone: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
  })) as jest.Mock,
});

/**
 * Creates a mock service with all methods as jest mocks
 */
export const createMockService = <T extends object>(): {
  [K in keyof T]: jest.Mock;
} => {
  return new Proxy(
    {},
    {
      get: (target, prop) => {
        if (!(prop in target)) {
          target[prop] = jest.fn();
        }
        return target[prop];
      },
    },
  ) as any;
};

/**
 * Helper to reset all mocks in a repository
 */
export const resetRepositoryMocks = (repository: MockRepository) => {
  Object.values(repository).forEach((mock) => {
    if (jest.isMockFunction(mock)) {
      mock.mockReset();
    }
  });
};
