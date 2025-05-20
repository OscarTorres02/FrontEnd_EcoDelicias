import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
//se imporntan componentes
import App from './App';
import HomeScreen from './Components/screens/homeScreen/HomeScreen';
import RecipesScreen from './Components/screens/recipesScreen/RecipesScreen';
import EcologicalBlogScreen from './Components/screens/ecologicalBlogScreen/EcologicalBlog';
import LoginScreen from './Components/screens/loginScreen/LoginScreen';
import ReportsScreen from './Components/screens/reportsScreen/ReportsScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<HomeScreen />} />
      <Route path="recipes"        element={<RecipesScreen />} />
      <Route path="ecologicalBlog"  element={<EcologicalBlogScreen />} />
      <Route path="login"             element={<LoginScreen />} />
      <Route path="reports"          element={<ReportsScreen />} />
    </Route>
  )
);

const container = document.getElementById('root');
if (!container) throw new Error('Root container missing in index.html');

createRoot(container).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
