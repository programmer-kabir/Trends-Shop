import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./Router/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "./Pages/Redux/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <Toaster />
    <Provider store={store}>
      <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
