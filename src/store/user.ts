import {create} from "zustand";

const useUserStore = create((set) => ({
  user: {},
  setUser: (value) => set({user: value})
}))

export default useUserStore