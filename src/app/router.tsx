import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { OfficePage } from '../pages/OfficePage';
import { DashboardHomePage } from '../pages/DashboardHomePage';
import { OfficeFloorBuilderPage } from '../pages/OfficeFloorBuilderPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path: 'app',
        element: <DashboardHomePage />,
      },
      {
        path: 'builder',
        element: <OfficeFloorBuilderPage />,
      },
      {
        path: 'room/:code',
        element: <OfficePage />,
      },
      {
        path: '*',
        element: <LandingPage />,
      },
    ],
  },
]);
