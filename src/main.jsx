// src/main.jsx
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import App from './App';
import { CartProvider } from './hooks/useCart';
import { AuthProvider } from './hooks/useAuth';
import './index.css';

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);