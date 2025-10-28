import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import Welcome from './pages/Welcome';
import Game from './pages/Game';
import RoomPage from './pages/Room';
import MainPage from './pages/Main';
import NotFound from './pages/NotFound';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import AuthRoute from './components/AuthRoute';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Public pages */}
      <Route
        index
        element={
          <AuthRoute>
            <Welcome />
          </AuthRoute>
        }
      />
      <Route
        path="sign-in"
        element={
          <AuthRoute>
            <SignIn />
          </AuthRoute>
        }
      />
      <Route
        path="sign-up"
        element={
          <AuthRoute>
            <SignUp />
          </AuthRoute>
        }
      />
      {/* Protected pages  */}
      <Route
        path="main"
        element={
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        }
      />
      <Route
        path="room/:id"
        element={
          <PrivateRoute>
            <RoomPage />
          </PrivateRoute>
        }
      />
      <Route
        path="game/:gameId"
        element={
          <PrivateRoute>
            <Game />
          </PrivateRoute>
        }
      />
      {/* <Route path="results/:gameId" element={<Results />} /> */}
      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
