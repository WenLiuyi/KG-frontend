export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: '登录',
        path: '/user/login',
        component: './user/Login',
        icon: 'LockOutlined', // 使用图标名称
      },
      {
        name: '注册页',
        path: '/user/register',
        component: './user/Register',
        icon: 'UserOutlined', // 使用图标名称
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/knowledgeGraph',
    name: '知识图谱管理',
    icon: 'BookOutlined', // 使用图标名称
    routes: [
      {
        path: '/knowledgeGraph',
        component: './knowledgeGraph/FileManagement',
      },
      {
        path: '/knowledgeGraph/Graphs/:fileId',
        component: './knowledgeGraph/graphs',
        // name: 'test',
        hideInMenu: true, // 在侧边栏中隐藏
      },
    ],
  },
  {
    path: '/studentAnalysis',
    name: '学生列表',
    icon: 'IdcardOutlined', // 使用图标名称
    routes: [
      {
        path: '/studentAnalysis',
        component: './studentAnalysis/StudentManagement',
      },
      {
        path: '/studentAnalysis/CodeAnalysis/:studentNum',
        component: './studentAnalysis/CodeAnalysis',
        hideInMenu: true, // 在侧边栏中隐藏
      },
    ],
  },
  {
    path: '/',
    redirect: '/knowledgeGraph',
  },
  {
    component: './404',
  },
];
