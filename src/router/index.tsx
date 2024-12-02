import {createBrowserRouter} from "react-router-dom";
import ConnectionWrapper from "./ConnectionWrapper";
import RegisterView from "@/views/RegisterView";
import ProfileView from "@/views/ProfileView.tsx";
import AdminView from "@/views/AdminView.tsx";
import StaffView from "@/views/StaffView.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ConnectionWrapper />,
    children: [
      {
        path: "/register",
        element: <RegisterView />,
      },
      {
        path: "/profile",
        element: <ProfileView />
      },
      {
        path: "/admin",
        element: <AdminView />
      },
      {
        path: "/staff",
        element: <StaffView />
      }
    ]
  }
])

export default router