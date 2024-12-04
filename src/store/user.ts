import {create} from "zustand";
import {User} from "@/types/users.ts";

interface UserState {
  user?: User

  setUser: (user: User) => void
  setUserInPlace: () => void
}

const useUserStore = create<UserState>((set) => ({
  user: undefined,

  setUser: (value) => set({user: value}),
  setUserInPlace: () => set(state => ({
    user: state.user
      ? {
        ...state.user,
        in_place: true,
      }
      : undefined,
  }))
}))

export default useUserStore