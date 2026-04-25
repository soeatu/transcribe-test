import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import { DashboardPage } from "./pages/DashboardPage";
import { SessionCreatePage } from "./pages/SessionCreatePage";
import { SessionPage } from "./pages/SessionPage";
import { SummaryPage } from "./pages/SummaryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "sessions/new", element: <SessionCreatePage /> },
      { path: "sessions/:id", element: <SessionPage /> },
      { path: "sessions/:id/summary", element: <SummaryPage /> },
    ],
  },
]);
