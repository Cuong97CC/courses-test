import React from 'react'
import { Edit } from '@refinedev/antd'
import { useForm } from '@refinedev/antd'
import { Form, Input, DatePicker, Select, InputNumber } from 'antd'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import type { ICourseUpdateInput, ICourse } from '../../types'
import { COURSE_VISIBILITY } from '../../types'
import dayjs from 'dayjs'

export const CourseEdit: React.FC = () => {
  const { formProps, saveButtonProps, queryResult } = useForm<
    ICourse,
    any,
    ICourseUpdateInput
  >()
  const [content, setContent] = React.useState('')

  const courseData = queryResult?.data?.data

  React.useEffect(() => {
    if (courseData?.content) {
      setContent(courseData.content)
    }
  }, [courseData])

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please enter course title' }]}
        >
          <Input placeholder="Enter course title" size="large" />
        </Form.Item>

        <Form.Item
          label="Summary"
          name="summary"
          rules={[{ required: true, message: 'Please enter course summary' }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Brief description of the course"
          />
        </Form.Item>

        <Form.Item
          label="Visibility"
          name="visibility"
          rules={[{ required: true }]}
        >
          <Select size="large">
            <Select.Option value={COURSE_VISIBILITY.PUBLIC}>
              Public
            </Select.Option>
            <Select.Option value={COURSE_VISIBILITY.PRIVATE}>
              Private
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Capacity"
          name="capacity"
          rules={[
            { required: true, message: 'Please enter capacity' },
            { type: 'number', min: 1, message: 'Capacity must be at least 1' },
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} size="large" />
        </Form.Item>

        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: 'Please select start date' }]}
          getValueProps={(value) => ({
            value: value ? dayjs(value) : undefined,
          })}
          normalize={(value) => (value ? value.format('YYYY-MM-DD') : '')}
        >
          <DatePicker style={{ width: '100%' }} size="large" />
        </Form.Item>

        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true, message: 'Please select end date' }]}
          getValueProps={(value) => ({
            value: value ? dayjs(value) : undefined,
          })}
          normalize={(value) => (value ? value.format('YYYY-MM-DD') : '')}
        >
          <DatePicker style={{ width: '100%' }} size="large" />
        </Form.Item>

        <Form.Item
          label="Course Content"
          name="content"
          rules={[{ required: true, message: 'Please enter course content' }]}
        >
          <CKEditor
            editor={ClassicEditor}
            data={content}
            onChange={(event, editor) => {
              const data = editor.getData()
              setContent(data)
              formProps.form?.setFieldsValue({ content: data })
            }}
            config={{
              toolbar: [
                'heading',
                '|',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                '|',
                'blockQuote',
                'insertTable',
                '|',
                'undo',
                'redo',
              ],
            }}
          />
        </Form.Item>

        {/* Hidden version field for optimistic locking */}
        <Form.Item name="version" hidden>
          <Input type="hidden" />
        </Form.Item>
      </Form>
    </Edit>
  )
}
