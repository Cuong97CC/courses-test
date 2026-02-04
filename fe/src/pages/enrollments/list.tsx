import React, { useState, useEffect } from 'react'
import { List, useTable, useSelect } from '@refinedev/antd'
import {
  Table,
  Typography,
  Button,
  Modal,
  message,
  Space,
  Tag,
  Form,
  Select,
  DatePicker,
  Card,
} from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import type {
  IEnrollment,
  EnrollmentStatus,
  UserRole,
  ICourse,
} from '../../types'
import {
  ENROLLMENT_STATUS,
  USER_ROLES,
  ENROLLMENT_STATUS_VALUES,
} from '../../types'
import {
  usePermissions,
  useCustomMutation,
  type HttpError,
} from '@refinedev/core'
import dayjs from 'dayjs'
import { getErrorMessage } from '../../utils/helper'

const { Text } = Typography
const { RangePicker } = DatePicker

export const EnrollmentList: React.FC = () => {
  const { data: permissions } = usePermissions<UserRole>()
  const { tableProps, tableQueryResult, searchFormProps, setFilters, filters } =
    useTable<IEnrollment, HttpError>({
      syncWithLocation: true,
      pagination: {
        pageSize: 10,
      },
      meta: {
        populate: ['student', 'course'],
      },
      onSearch: (values: any) => {
        const filters: any[] = []

        if (values.status) {
          filters.push({
            field: 'status',
            operator: 'eq' as const,
            value: values.status,
          })
        }

        if (values.course_id) {
          filters.push({
            field: 'course_id',
            operator: 'eq' as const,
            value: values.course_id,
          })
        }

        if (values.created_at && values.created_at.length === 2) {
          filters.push({
            field: 'created_at_from',
            operator: 'eq' as const,
            value: values.created_at[0].startOf('day').toISOString(),
          })
          filters.push({
            field: 'created_at_to',
            operator: 'eq' as const,
            value: values.created_at[1].endOf('day').toISOString(),
          })
        }

        return filters
      },
    })

  const { selectProps: courseSelectProps } = useSelect<ICourse>({
    resource: 'courses',
    optionLabel: 'title',
    optionValue: 'id',
    onSearch: (value) => [
      {
        field: 'search',
        operator: 'eq',
        value,
      },
    ],
  })

  const handleSubmit = (values: any) => {
    const newFilters: any[] = []

    if (values.status) {
      newFilters.push({
        field: 'status',
        operator: 'eq' as const,
        value: values.status,
      })
    }

    if (values.course_id) {
      newFilters.push({
        field: 'course_id',
        operator: 'eq' as const,
        value: values.course_id,
      })
    }

    if (values.created_at && values.created_at.length === 2) {
      newFilters.push({
        field: 'created_at_from',
        operator: 'eq' as const,
        value: values.created_at[0].startOf('day').toISOString(),
      })
      newFilters.push({
        field: 'created_at_to',
        operator: 'eq' as const,
        value: values.created_at[1].endOf('day').toISOString(),
      })
    }

    setFilters(newFilters, 'replace')
  }

  useEffect(() => {
    if (filters && searchFormProps.form) {
      const formValues: any = {
        status: undefined,
        course_id: undefined,
        created_at: undefined,
      }

      filters.forEach((filter: any) => {
        if (filter.field === 'status') {
          formValues.status = filter.value
        } else if (filter.field === 'course_id') {
          formValues.course_id = filter.value
        } else if (filter.field === 'created_at_from') {
          if (!formValues.created_at) {
            formValues.created_at = []
          }
          formValues.created_at[0] = dayjs(filter.value)
        } else if (filter.field === 'created_at_to') {
          if (!formValues.created_at) {
            formValues.created_at = []
          }
          formValues.created_at[1] = dayjs(filter.value)
        }
      })

      searchFormProps.form.setFieldsValue(formValues)
    }
  }, [filters, searchFormProps.form])

  const [processingId, setProcessingId] = useState<string | null>(null)
  const { mutate: processEnrollment } = useCustomMutation()

  const handleProcess = (id: string, status: EnrollmentStatus) => {
    Modal.confirm({
      title: `Are you sure you want to ${status === ENROLLMENT_STATUS.APPROVED ? 'approve' : 'reject'} this enrollment?`,
      onOk: async () => {
        setProcessingId(id)
        try {
          await new Promise<void>((resolve, reject) => {
            processEnrollment(
              {
                url: `/enrollments/${id}/process`,
                method: 'patch',
                values: { status },
              },
              {
                onSuccess: () => resolve(),
                onError: reject,
              },
            )
          })

          message.success(
            `Enrollment ${status === ENROLLMENT_STATUS.APPROVED ? 'approved' : 'rejected'} successfully`,
          )
          tableQueryResult?.refetch()
        } catch (error: any) {
          message.error(getErrorMessage(error))
        } finally {
          setProcessingId(null)
        }
      },
    })
  }

  const isManager = permissions === USER_ROLES.MANAGER

  return (
    <List>
      <Card style={{ marginBottom: 16 }}>
        <Form
          form={searchFormProps.form}
          layout="inline"
          onFinish={handleSubmit}
        >
          <Form.Item label="Status" name="status">
            <Select
              placeholder="Filter by status"
              allowClear
              style={{ width: 180 }}
            >
              {ENROLLMENT_STATUS_VALUES.map((status) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Course" name="course_id">
            <Select
              {...courseSelectProps}
              placeholder="Filter by course"
              allowClear
              style={{ width: 250 }}
            />
          </Form.Item>

          <Form.Item label="Created Date" name="created_at">
            <RangePicker format="MMM DD, YYYY" style={{ width: 280 }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Filter
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              onClick={() => {
                searchFormProps.form?.resetFields()
                setFilters([], 'replace')
              }}
            >
              Reset
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex={['student', 'first_name']}
          title="Student"
          render={(value) => <Text strong>{value}</Text>}
        />
        <Table.Column
          dataIndex={['student', 'email']}
          title="Email"
          render={(value) => <Text type="secondary">{value}</Text>}
        />
        <Table.Column
          dataIndex={['course', 'title']}
          title="Course"
          render={(value) => <Text>{value}</Text>}
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
          dataIndex="created_at"
          title="Requested At"
          render={(value) => dayjs(value).format('MMM DD, YYYY HH:mm')}
        />
        <Table.Column
          dataIndex="approved_at"
          title="Processed At"
          render={(value) =>
            value ? dayjs(value).format('MMM DD, YYYY HH:mm') : '-'
          }
        />
        {isManager && (
          <Table.Column
            title="Actions"
            render={(_, record: IEnrollment) => {
              const isProcessing = processingId === record.id
              if (record.status === ENROLLMENT_STATUS.PENDING) {
                return (
                  <Space>
                    <Button
                      type="primary"
                      size="small"
                      icon={<CheckOutlined />}
                      loading={isProcessing}
                      disabled={isProcessing}
                      onClick={() =>
                        handleProcess(record.id, ENROLLMENT_STATUS.APPROVED)
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      danger
                      size="small"
                      icon={<CloseOutlined />}
                      loading={isProcessing}
                      disabled={isProcessing}
                      onClick={() =>
                        handleProcess(record.id, ENROLLMENT_STATUS.REJECTED)
                      }
                    >
                      Reject
                    </Button>
                  </Space>
                )
              }
              return <Text type="secondary">-</Text>
            }}
          />
        )}
      </Table>
    </List>
  )
}
