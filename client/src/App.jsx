import { BrowserRouter as Router, useRoutes } from "react-router-dom";

import ReadItems from "./pages/ReadItems";
// import CreateItem from "./pages/CreateItem";
// import EditItem from "./pages/EditItem";
// import ItemDetails from "./pages/ItemDetails";
// import CreateRequest from "./pages/CreateRequest";
// import UserProfile from "./pages/UserProfile";

import "./App.css";

function AppRoutes() {
  return useRoutes([
    { path: "/", element: <ReadItems /> },
    // { path: "/items/new", element: <CreateItem /> },
    // { path: "/items/:id", element: <ItemDetails /> },
    // { path: "/items/:id/edit", element: <EditItem /> },
    // { path: "/request/new/:itemId", element: <CreateRequest /> },
    // { path: "/user/:id", element: <UserProfile /> },

    // Catch-all 404 route
    { path: "*", element: <h2 style={{ padding: 20 }}>Page Not Found</h2> },
  ]);
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
