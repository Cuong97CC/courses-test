import React from 'react'
import { Show } from '@refinedev/antd'
import { useShow, usePermissions, useCustomMutation } from '@refinedev/core'
import { Typography, Descriptions, Tag, Button, Space, message } from 'antd'
import {
  CalendarOutlined,
  UserOutlined,
  EyeOutlined,
  BookOutlined,
} from '@ant-design/icons'
import type { ICourse, UserRole, IEnrollmentCreateInput } from '../../types'
import { USER_ROLES, COURSE_VISIBILITY } from '../../types'
import dayjs from 'dayjs'

const { Title, Paragraph } = Typography

export const CourseShow: React.FC = () => {
  const { queryResult } = useShow<ICourse>()
  const { data, isLoading } = queryResult
  const course = data?.data
  const { data: permissions } = usePermissions<UserRole>()

  const { mutate: createEnrollment, isLoading: isEnrolling } =
    useCustomMutation<ICourse>()

  const isStudent = permissions === USER_ROLES.STUDENT
  const canEnroll = isStudent && course && !course.is_enrolled

  const handleEnroll = async () => {
    if (!course) return

    const enrollmentData: IEnrollmentCreateInput = {
      course_id: course.id,
    }

    createEnrollment(
      {
        url: '/enrollments',
        method: 'post',
        values: enrollmentData,
      },
      {
        onSuccess: () => {
          message.success('Enrollment request submitted successfully!')
          queryResult?.refetch()
        },
        onError: (error: any) => {
          const errorMessage =
            error?.message || 'Failed to submit enrollment request'
          message.error(errorMessage)
        },
      },
    )
  }

  const canEdit =
    permissions === USER_ROLES.MANAGER || permissions === USER_ROLES.INSTRUCTOR

  return (
    <Show isLoading={isLoading} canEdit={canEdit}>
      {course && (
        <>
          <div style={{ marginBottom: '24px' }}>
            <Space>
              <Tag
                color={
                  course.visibility === COURSE_VISIBILITY.PUBLIC
                    ? 'green'
                    : 'orange'
                }
                icon={<EyeOutlined />}
              >
                {course.visibility}
              </Tag>
              {dayjs().isAfter(dayjs(course.end_date)) && (
                <Tag color="default">Ended</Tag>
              )}
              {(course.enrolled_count || 0) >= course.capacity && (
                <Tag color="red">Full</Tag>
              )}
            </Space>
          </div>

          <Title level={2}>{course.title}</Title>
          <Paragraph style={{ fontSize: '16px', color: '#6B7280' }}>
            {course.summary}
          </Paragraph>

          <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
            <Descriptions.Item
              label={
                <>
                  <CalendarOutlined /> Start Date
                </>
              }
            >
              {dayjs(course.start_date).format('MMM DD, YYYY')}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <CalendarOutlined /> End Date
                </>
              }
            >
              {dayjs(course.end_date).format('MMM DD, YYYY')}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <UserOutlined /> Capacity
                </>
              }
            >
              {course.enrolled_count || 0} / {course.capacity}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <BookOutlined /> Instructor
                </>
              }
            >
              {course.instructor?.first_name || 'N/A'}
            </Descriptions.Item>
          </Descriptions>

          {canEnroll && (
            <Button
              type="primary"
              size="large"
              onClick={handleEnroll}
              loading={isEnrolling}
              disabled={
                isEnrolling ||
                dayjs().isAfter(dayjs(course.end_date)) ||
                (course.enrolled_count || 0) >= course.capacity
              }
              style={{ marginBottom: '24px' }}
            >
              {course.is_enrolled
                ? 'Enrollment Requested'
                : 'Enroll in this Course'}
            </Button>
          )}

          <div
            style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
            }}
          >
            <Title level={4}>Course Content</Title>
            <div
              dangerouslySetInnerHTML={{ __html: course.content }}
              style={{
                lineHeight: '1.8',
                color: '#374151',
              }}
            />
          </div>
        </>
      )}
    </Show>
  )
}
