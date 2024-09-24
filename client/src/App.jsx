import { Navigate, Route, Routes } from 'react-router-dom';
import UploadVideo from './pages/UploadVideo';
import VideosList from './pages/VideosList';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VideoDetails from './pages/VideoDetails';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';
import { useSelector } from 'react-redux';
import { useSocketConnection } from './components/SocketProvider'; // Ensure your socket provider is correctly set up
import LiveStream from './components/LiveStream';
import CreateRoom from './components/CreateRoom';
import UserProfile from './pages/UserProfile';

const App = () => {
  const { currentUser: user } = useSelector((state) => state.user);

  // Establish socket connection using the hook outside of the effect
  useSocketConnection(); // Hook should be called directly here, not inside useEffect

  return (
    <>
      <Navbar />
      <div className='px-[5%] xl:px-24 py-8'>
        <Routes>
          {/* Protect routes, redirect to login if no user is logged in */}
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/upload" element={user ? <UploadVideo /> : <Navigate to="/login" />} />
          <Route path="/videos" element={user ? <VideosList /> : <Navigate to="/login" />} />
          <Route path="/watch/video/:id" element={user ? <VideoDetails /> : <Navigate to="/login" />} />
          <Route path="/signup" element={user ? <Navigate to="/videos" /> : <SignUp />} />
          <Route path="/login" element={user ? <Navigate to="/videos" /> : <Login />} />

          <Route path="/live/:roomId" element={<LiveStream />} />
          <Route path="/create-room" element={<CreateRoom />} />

          <Route path="/user-profile/:userId" element={<UserProfile />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;