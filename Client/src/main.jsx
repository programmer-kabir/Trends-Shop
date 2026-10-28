import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./Router/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "./Pages/Redux/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./Provider/AuthProvider";
import WishlistData from "./Components/Context/WishlistData";
import FavoritesProvider from "./Provider/FavoritesContext";
import ThemeProvider from "./Provider/ThemeContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <WishlistData>
            <FavoritesProvider>
              <Provider store={store}>
                <RouterProvider router={router} />
              </Provider>
            </FavoritesProvider>
          </WishlistData>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
