import React from 'react'
import {
  List,
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
} from '@refinedev/antd'
import { Table, Typography, Space, Tag } from 'antd'
import type { ICourse, UserRole } from '../../types'
import { USER_ROLES, COURSE_VISIBILITY } from '../../types'
import { usePermissions } from '@refinedev/core'
import dayjs from 'dayjs'

const { Text } = Typography

export const CourseList: React.FC = () => {
  const { data: permissions } = usePermissions<UserRole>()
  const { tableProps } = useTable<ICourse>({
    syncWithLocation: true,
    pagination: {
      pageSize: 10,
    },
  })

  const canEdit =
    permissions === USER_ROLES.MANAGER || permissions === USER_ROLES.INSTRUCTOR
  const canDelete = permissions === USER_ROLES.MANAGER
  const canCreate = canEdit

  return (
    <List canCreate={canCreate}>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="title"
          title="Title"
          sorter
          render={(value) => <Text strong>{value}</Text>}
        />
        <Table.Column
          dataIndex="summary"
          title="Summary"
          ellipsis
          render={(value) => (
            <Text type="secondary" ellipsis style={{ maxWidth: '300px' }}>
              {value}
            </Text>
          )}
        />
        <Table.Column
          dataIndex="visibility"
          title="Visibility"
          render={(value) => (
            <Tag
              color={value === COURSE_VISIBILITY.PUBLIC ? 'green' : 'orange'}
            >
              {value}
            </Tag>
          )}
        />
        <Table.Column
          dataIndex="capacity"
          title="Capacity"
          align="center"
          render={(_, record: ICourse) => (
            <Text>
              {record.enrolledCount || 0} / {record.capacity}
            </Text>
          )}
        />
        <Table.Column
          dataIndex="startDate"
          title="Start Date"
          render={(value) => dayjs(value).format('MMM DD, YYYY')}
        />
        <Table.Column
          dataIndex="endDate"
          title="End Date"
          render={(value) => dayjs(value).format('MMM DD, YYYY')}
        />
        <Table.Column
          title="Status"
          render={(_, record: ICourse) => {
            const now = dayjs()
            const endDate = dayjs(record.endDate)
            const isFull = (record.enrolledCount || 0) >= record.capacity
            const isEnded = now.isAfter(endDate)

            if (isEnded) {
              return <Tag color="default">Ended</Tag>
            }
            if (isFull) {
              return <Tag color="red">Full</Tag>
            }
            return <Tag color="success">Open</Tag>
          }}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: ICourse) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              {canEdit && (
                <EditButton hideText size="small" recordItemId={record.id} />
              )}
              {canDelete && (
                <DeleteButton hideText size="small" recordItemId={record.id} />
              )}
            </Space>
          )}
        />
      </Table>
    </List>
  )
}
