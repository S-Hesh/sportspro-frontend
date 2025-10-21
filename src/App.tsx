import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import React Query
import Auth from './pages/Auth';  // Import your Auth component
import Index from './pages/Index';  // Import your Index (Home) component
import Profile from './pages/Profile';  // Import your Profile component
import NotFound from './pages/NotFound';  // Import the NotFound component
import Networking from './pages/Networking';
import Opportunities from './pages/Oppotunities';
import Header from './components/Header';  // Import the Header component
import SearchResultsPage from "@/pages/SearchResultsPage"; // Import SearchResultsPage

// Create a QueryClient instance
const queryClient = new QueryClient();

// MainLayout component to include Header
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  // useLocation inside MainLayout now
  const location = useLocation();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Only show Header if the route is not '/auth' */}
      {location.pathname !== '/auth' && <Header />}
      {children}
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Authentication Route without Header */}
          <Route path="/auth" element={<Auth />} />

          {/* All other routes wrapped in MainLayout, which includes the Header */}
          <Route path="/" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
          <Route path="/networking" element={<MainLayout><Networking /></MainLayout>} />
          <Route path="/opportunities" element={<MainLayout><Opportunities /></MainLayout>} />
          <Route path="/search" element={<SearchResultsPage />} />

          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
