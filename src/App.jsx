import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { WishlistProvider } from './contexts/WishlistContext';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <WishlistProvider>
            <AppRoutes />
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '14px',
                },
              }}
            />
          </WishlistProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
