import React, { useState } from 'react'
import { usePermissions, useCustomMutation } from '@refinedev/core'
import { useTable } from '@refinedev/antd'
import { Table, Typography, Tag, Card, Button, Modal, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import type { IEnrollment, EnrollmentStatus, UserRole } from '../../types'
import { ENROLLMENT_STATUS, USER_ROLES } from '../../types'
import dayjs from 'dayjs'
import { getErrorMessage } from '../../utils/helper'

const { Title, Text } = Typography

export const MyEnrollments: React.FC = () => {
  const { data: permissions } = usePermissions<UserRole>()
  const { tableProps, tableQueryResult } = useTable<IEnrollment>({
    resource: 'enrollments',
    meta: {
      populate: ['course'],
    },
  })

  const [cancelingId, setCancelingId] = useState<string | null>(null)
  const { mutate: cancelEnrollment } = useCustomMutation()

  const handleCancel = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to cancel this enrollment?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Cancel',
      okButtonProps: { danger: true },
      onOk: async () => {
        setCancelingId(id)
        try {
          await new Promise<void>((resolve, reject) => {
            cancelEnrollment(
              {
                url: `/enrollments/${id}`,
                method: 'delete',
                values: {},
              },
              {
                onSuccess: () => resolve(),
                onError: reject,
              },
            )
          })

          message.success('Enrollment canceled successfully')
          tableQueryResult?.refetch()
        } catch (error: any) {
          message.error(getErrorMessage(error))
        } finally {
          setCancelingId(null)
        }
      },
    })
  }

  if (permissions !== USER_ROLES.STUDENT) {
    return (
      <Card>
        <Text type="secondary">This page is only available for students.</Text>
      </Card>
    )
  }

  return (
    <div>
      <Title level={2} style={{ marginBottom: '24px' }}>
        My Enrollments
      </Title>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex={['course', 'title']}
          title="Course"
          render={(value) => <Text strong>{value}</Text>}
        />
        <Table.Column
          dataIndex={['course', 'startDate']}
          title="Start Date"
          render={(value) => dayjs(value).format('MMM DD, YYYY')}
        />
        <Table.Column
          dataIndex={['course', 'endDate']}
          title="End Date"
          render={(value) => dayjs(value).format('MMM DD, YYYY')}
        />
        <Table.Column
          dataIndex="status"
          title="Status"
          render={(value: EnrollmentStatus) => {
            const colors = {
              [ENROLLMENT_STATUS.PENDING]: 'orange',
              [ENROLLMENT_STATUS.APPROVED]: 'green',
              [ENROLLMENT_STATUS.REJECTED]: 'red',
              [ENROLLMENT_STATUS.CANCELLED]: 'gray',
            }
            return <Tag color={colors[value]}>{value}</Tag>
          }}
        />
        <Table.Column
          dataIndex="createdAt"
          title="Requested At"
          render={(value) => dayjs(value).format('MMM DD, YYYY HH:mm')}
        />
        <Table.Column
          dataIndex="approvedAt"
          title="Processed At"
          render={(value) =>
            value
              ? dayjs(value).format('MMM DD, YYYY HH:mm')
              : 'Waiting approval'
          }
        />
        <Table.Column
          title="Actions"
          render={(_, record: IEnrollment) => {
            const canCancel = record.status === ENROLLMENT_STATUS.PENDING
            const isCanceling = cancelingId === record.id

            if (canCancel) {
              return (
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  loading={isCanceling}
                  disabled={isCanceling}
                  onClick={() => handleCancel(record.id)}
                >
                  Cancel
                </Button>
              )
            }

            return <Text type="secondary">-</Text>
          }}
        />
      </Table>
    </div>
  )
}
