import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './ui/components/Layout';
import { HomePage } from './ui/pages/HomePage';
import { FriendsPage } from './ui/pages/FriendsPage';
import { FriendDetailPage } from './ui/pages/FriendDetailPage';
import './ui/styles/tokens.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="friends" element={<FriendsPage />} />
          <Route path="friends/:friendId" element={<FriendDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
