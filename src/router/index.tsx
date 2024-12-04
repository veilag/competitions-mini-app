import {createBrowserRouter} from "react-router-dom";
import ConnectionWrapper from "./ConnectionWrapper";
import RegisterView from "@/views/RegisterView";
import ProfileView from "@/views/ProfileView.tsx";
import AdminView from "@/views/AdminView.tsx";
import StaffView from "@/views/StaffView.tsx";
import AwardingView from "@/views/AwardingView.tsx";
import AwardingStaffView from "@/views/AwardingStaffView.tsx";

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
      },
      {
        path: "/awarding",
        element: <AwardingView />
      },
      {
        path: "/staff_awarding",
        element: <AwardingStaffView />
      }
    ]
  }
])

export default router