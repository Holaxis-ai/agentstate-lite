import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query/queryClient.js";
import { App } from "./App.js";
import "./styles.css";

const container = document.getElementById("root");
if (!container) throw new Error("missing #root element");

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
