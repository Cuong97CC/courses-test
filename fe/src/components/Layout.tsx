import React from 'react'
import { ThemedLayoutV2, ThemedTitleV2 } from '@refinedev/antd'
import { useGetIdentity, useLogout } from '@refinedev/core'
import {
  Layout as AntdLayout,
  Avatar,
  Typography,
  Space,
  Dropdown,
  type MenuProps,
} from 'antd'
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import type { IUser } from '../types'

const { Header } = AntdLayout
const { Text } = Typography

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: user } = useGetIdentity<IUser>()
  const { mutate: logout } = useLogout()

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      logout()
    }
    // Profile settings can be implemented later
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <SettingOutlined />,
      label: 'Profile Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ]

  return (
    <ThemedLayoutV2
      Title={(titleProps) => (
        <ThemedTitleV2 {...titleProps} text="Course Portal" />
      )}
      Header={() => (
        <Header
          style={{
            backgroundColor: '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          {user && (
            <Dropdown
              menu={{ items: menuItems, onClick: handleMenuClick }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  style={{
                    backgroundColor: '#0D9488',
                  }}
                  icon={<UserOutlined />}
                />
                <Space direction="vertical">
                  <Text strong>{user.firstName}</Text>
                </Space>
              </Space>
            </Dropdown>
          )}
        </Header>
      )}
    >
      {children}
    </ThemedLayoutV2>
  )
}
