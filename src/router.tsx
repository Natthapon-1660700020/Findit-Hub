import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { ExplorePage } from './pages/ExplorePage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { SavedItemsPage } from './pages/SavedItemsPage';
import { ReportItemPage } from './pages/ReportItemPage';
import { AboutPage } from './pages/AboutPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ExplorePage />, // หน้า 1: Items Page
      },
      {
        path: 'items/:id',
        element: <ItemDetailPage />, // หน้า 2: Detail Page (Dynamic Route)
      },
      {
        path: 'saved',
        element: <SavedItemsPage />, // หน้า 3: Collection Page
      },
      {
        path: 'report',
        element: <ReportItemPage />, // หน้า 4: Custom Extended Page
      },
      {
        path: 'about',
        element: <AboutPage />, // หน้า 5: About Page
      },
    ],
  },
]);