import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import Welcome from './pages/Welcome';
import Game from './pages/Game';
import Lobby from './pages/Lobby';
import Main from './pages/Main';
import NotFound from './pages/NotFound';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Layout from './components/Layout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Public pages */}
      <Route index element={<Welcome />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="sign-up" element={<SignUp />} />
      {/* Protected pages  */}
      <Route path="main" element={<Main />} />
      <Route path="lobby/:roomId" element={<Lobby />} />
      <Route path="game/:gameId" element={<Game />} />
      {/* <Route path="results/:gameId" element={<Results />} /> */}
      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
