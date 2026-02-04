import React from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useLogin } from '@refinedev/core'
import type { ILoginRequest } from '../types'

const { Title, Text } = Typography

export const Login: React.FC = () => {
  const { mutate: login, isLoading } = useLogin<ILoginRequest>()

  const onFinish = (values: ILoginRequest) => {
    login(values, {
      onError: (error) => {
        message.error(error.message || 'Login failed')
      },
    })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ marginBottom: '8px', color: '#0D9488' }}>
            Course Portal
          </Title>
          <Text type="secondary">Sign in to your account</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="student1@example.com"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="password123"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '8px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              style={{ height: '48px', fontSize: '16px' }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            background: '#F0FDFA',
            borderRadius: '8px',
          }}
        >
          <Text
            type="secondary"
            style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}
          >
            <strong>Demo Accounts:</strong>
          </Text>
          <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
            Student: student1@example.com
          </Text>
          <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
            Instructor: instructor1@example.com
          </Text>
          <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
            Manager: manager1@example.com
          </Text>
          <Text
            type="secondary"
            style={{ fontSize: '12px', display: 'block', marginTop: '8px' }}
          >
            Password: password123
          </Text>
        </div>
      </Card>
    </div>
  )
}
