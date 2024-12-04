import {createBrowserRouter} from "react-router-dom";
import ConnectionWrapper from "./ConnectionWrapper";
import RegisterView from "@/views/RegisterView";
import ProfileView from "@/views/ProfileView.tsx";
import AdminView from "@/views/AdminView.tsx";
import StaffView from "@/views/StaffView.tsx";
import AwardingView from "@/views/AwardingView.tsx";
import AdminWinnersView from "@/views/AdminWinnersView.tsx";
import AdminSetWinnersView from "@/views/AdminSetWinnersView.tsx";
import AdminSetNominationsView from "@/views/AdminSetNominationsView.tsx";

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
        path: "/admin/winners/:competitionId",
        element: <AdminWinnersView />
      },
      {
        path: "/admin/set_winners/:competitionId",
        element: <AdminSetWinnersView />
      },
      {
        path: "/admin/set_nominations/:competitionId",
        element: <AdminSetNominationsView />
      },
      {
        path: "/staff",
        element: <StaffView />
      },
      {
        path: "/awarding",
        element: <AwardingView />
      }
    ]
  }
])

export default router