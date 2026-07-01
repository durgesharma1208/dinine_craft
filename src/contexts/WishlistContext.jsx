import { createContext, useContext } from 'react';
import { useWishlist } from '../hooks/useWishlist';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const wishlistData = useWishlist();
  return (
    <WishlistContext.Provider value={wishlistData}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlistContext must be used within a WishlistProvider');
  }
  return context;
}
