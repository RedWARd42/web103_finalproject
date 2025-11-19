// import { BrowserRouter as Router, useRoutes } from "react-router-dom";

// import ReadItems from "./pages/ReadItems";
// // import CreateItem from "./pages/CreateItem";
// // import EditItem from "./pages/EditItem";
// // import ItemDetails from "./pages/ItemDetails";
// // import CreateRequest from "./pages/CreateRequest";
// // import UserProfile from "./pages/UserProfile";

// import "./App.css";

// function AppRoutes() {
//   return useRoutes([
//     { path: "/", element: <ReadItems /> },
//     // { path: "/items/new", element: <CreateItem /> },
//     // { path: "/items/:id", element: <ItemDetails /> },
//     // { path: "/items/:id/edit", element: <EditItem /> },
//     // { path: "/request/new/:itemId", element: <CreateRequest /> },
//     // { path: "/user/:id", element: <UserProfile /> },

//     // Catch-all 404 route
//     { path: "*", element: <h2 style={{ padding: 20 }}>Page Not Found</h2> },
//   ]);
// }

// export default function App() {
//   return (
//     <Router>
//       <AppRoutes />
//     </Router>
//   );
// }

// import { BrowserRouter as Router, Link, useRoutes } from "react-router-dom";

// import ReadItems from "./pages/ReadItems";
// import UserProfile from "./pages/UserProfile";

// import "./App.css";

// // TEMPORARY: Replace with real logged-in ID when you add auth
// const LOGGED_IN_USER_ID = 1;

// function AppRoutes() {
//   return useRoutes([
//     { path: "/", element: <ReadItems /> },
//     { path: "/user/:id", element: <UserProfile /> },

//     // Catch-all 404
//     { path: "*", element: <h2 style={{ padding: 20 }}>Page Not Found</h2> },
//   ]);
// }

// export default function App() {
//   return (
//     <Router>
//       {/* 🔥 GLOBAL NAV BAR WITH PROFILE BUTTON */}
//       <div className="app-header">
//         <h1 className="app-logo">BorrowBuddy</h1>

//         <Link to={`/user/${LOGGED_IN_USER_ID}`} className="profile-btn">
//           Profile
//         </Link>
//       </div>

//       <AppRoutes />
//     </Router>
//   );
// }


import { BrowserRouter as Router, Link, useRoutes } from "react-router-dom";

import ReadItems from "./pages/ReadItems";
import UserProfile from "./pages/UserProfile";

import "./App.css";

// TEMPORARY: Replace with real logged-in ID when you add auth
const LOGGED_IN_USER_ID = 1;

function AppRoutes() {
  return useRoutes([
    { path: "/", element: <ReadItems /> },
    { path: "/user/:id", element: <UserProfile /> },

    // Catch-all 404
    { path: "*", element: <h2 style={{ padding: 20 }}>Page Not Found</h2> },
  ]);
}

export default function App() {
  return (
    <Router>
      {/* 🔥 GLOBAL NAV BAR WITH PROFILE & BROWSE ITEMS BUTTON */}
        <div className="app-header">
            <h1 className="app-logo">BorrowBuddy</h1>

            <div className="header-buttons">
                <Link to="/" className="browse-btn">
                Browse Items
                </Link>
                <Link to={`/user/${LOGGED_IN_USER_ID}`} className="profile-btn">
                Profile
                </Link>
            </div>
        </div>



      <AppRoutes />
    </Router>
  );
}
