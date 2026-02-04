import type { DataProvider } from '@refinedev/core'
import axiosInstance from '../utils/axios'
import type { AxiosInstance } from 'axios'
import { stringify } from 'query-string'

export const dataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance,
): DataProvider => ({
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const url = `${apiUrl}/${resource}`

    const { current = 1, pageSize = 10 } = pagination ?? {}

    const queryFilters: any = {}

    filters?.forEach((filter) => {
      if ('field' in filter) {
        queryFilters[filter.field] = filter.value
      }
    })

    const query: any = {
      page: current,
      size: pageSize,
      ...queryFilters,
    }

    if (sorters && sorters.length > 0) {
      const sortQuery = sorters
        .map(
          (sorter) =>
            `${sorter.field}:${sorter.order === 'asc' ? 'ASC' : 'DESC'}`,
        )
        .join(',')
      query.sort = sortQuery
    }

    const { data } = await httpClient.get(`${url}?${stringify(query)}`)

    return {
      data: data.data,
      total: data?.total || data.data?.length,
    }
  },

  getMany: async ({ resource, ids }) => {
    const { data } = await httpClient.get(
      `${apiUrl}/${resource}?${stringify({ id: ids })}`,
    )

    return {
      data: data.data,
    }
  },

  getOne: async ({ resource, id }) => {
    const { data } = await httpClient.get(`${apiUrl}/${resource}/${id}`)

    return {
      data: data.data || data,
    }
  },

  create: async ({ resource, variables }) => {
    const url = `${apiUrl}/${resource}`

    const { data } = await httpClient.post(url, variables)

    return {
      data: data.data || data,
    }
  },

  update: async ({ resource, id, variables }) => {
    const url = `${apiUrl}/${resource}/${id}`

    const { data } = await httpClient.patch(url, variables)

    return {
      data: data.data || data,
    }
  },

  deleteOne: async ({ resource, id }) => {
    const url = `${apiUrl}/${resource}/${id}`

    const { data } = await httpClient.delete(url)

    return {
      data: data.data || data,
    }
  },

  getApiUrl: () => apiUrl,

  custom: async ({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
  }) => {
    let requestUrl = `${url}?`

    if (sorters && sorters.length > 0) {
      const sortQuery = sorters
        .map((sorter) => `${sorter.field}:${sorter.order}`)
        .join(',')
      requestUrl = `${requestUrl}&${stringify({ sort: sortQuery })}`
    }

    if (filters) {
      const filterQuery: any = {}
      filters.forEach((filter) => {
        if ('field' in filter) {
          filterQuery[filter.field] = filter.value
        }
      })
      requestUrl = `${requestUrl}&${stringify(filterQuery)}`
    }

    if (query) {
      requestUrl = `${requestUrl}&${stringify(query)}`
    }

    const { data } = await httpClient({
      url: requestUrl,
      method,
      data: payload,
      headers,
    })

    return { data }
  },
})
