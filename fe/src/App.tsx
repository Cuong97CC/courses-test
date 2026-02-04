import { Refine, Authenticated } from '@refinedev/core'
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'
import routerBindings, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from '@refinedev/react-router-v6'
import { ConfigProvider, App as AntdApp } from 'antd'
import { BookOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'

import { authProvider } from './providers/authProvider'
import { dataProvider } from './providers/dataProvider'
import { accessControlProvider } from './providers/accessControlProvider'
import { API_URL } from './utils/constants'
import { themeConfig } from './utils/theme'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import {
  CourseList,
  CourseShow,
  CourseCreate,
  CourseEdit,
} from './pages/courses'
import { EnrollmentList, MyEnrollments } from './pages/enrollments'

import '@refinedev/antd/dist/reset.css'

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider theme={themeConfig}>
        <AntdApp>
          <Refine
            authProvider={authProvider}
            dataProvider={dataProvider(API_URL)}
            accessControlProvider={accessControlProvider}
            routerProvider={routerBindings}
            resources={[
              {
                name: 'courses',
                list: '/courses',
                show: '/courses/show/:id',
                create: '/courses/create',
                edit: '/courses/edit/:id',
                meta: {
                  icon: <BookOutlined />,
                  label: 'Courses',
                },
              },
              {
                name: 'enrollments',
                list: '/enrollments',
                meta: {
                  icon: <TeamOutlined />,
                  label: 'Enrollments',
                },
              },
              {
                name: 'my-enrollments',
                list: '/my-enrollments',
                meta: {
                  icon: <UserOutlined />,
                  label: 'My Enrollments',
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              projectId: 'course-enrollment-portal',
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-outer"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <Layout>
                      <Outlet />
                    </Layout>
                  </Authenticated>
                }
              >
                <Route
                  index
                  element={<NavigateToResource resource="courses" />}
                />

                {/* Courses */}
                <Route path="/courses">
                  <Route index element={<CourseList />} />
                  <Route path="show/:id" element={<CourseShow />} />
                  <Route path="create" element={<CourseCreate />} />
                  <Route path="edit/:id" element={<CourseEdit />} />
                </Route>

                {/* Enrollments */}
                <Route path="/enrollments" element={<EnrollmentList />} />
                <Route path="/my-enrollments" element={<MyEnrollments />} />
              </Route>

              <Route
                element={
                  <Authenticated
                    key="authenticated-inner"
                    fallback={<Outlet />}
                  >
                    <NavigateToResource />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<Login />} />
              </Route>
            </Routes>

            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  )
}

export default App
