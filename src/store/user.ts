import {create} from "zustand";
import {User} from "@/types/users.ts";

interface UserState {
  user?: User
  setUser: (user: User) => void
}

const useUserStore = create<UserState>((set) => ({
  user: undefined,
  setUser: (value) => set({user: value})
}))

export default useUserStore