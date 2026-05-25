import { Outlet } from 'react-router-dom';

import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

function AppLayout() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;

