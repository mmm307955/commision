import { createBrowserRouter } from 'react-router';
import { Layout } from './Layout';
import { HomePage } from '@/pages/HomePage';
import { CommissionDetailPage } from '@/pages/CommissionDetailPage';
import { MyPage } from '@/pages/MyPage';
import { LoginPage } from '@/pages/LoginPage';
import { OAuthCallbackPage } from '@/pages/OAuthCallbackPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'commission/:id', Component: CommissionDetailPage },
      { path: 'mypage', Component: MyPage },
    ],
  },
  { path: '/login', Component: LoginPage },
  { path: '/oauth/callback', Component: OAuthCallbackPage },
]);

