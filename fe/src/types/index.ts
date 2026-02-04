export * from './user'
export * from './course'
export * from './enrollment'
export { accessControlProvider } from '../providers/accessControlProvider'

export interface IApiListResponse<T> {
  data: T[]
  total: number
  page: number
  size: number
}
