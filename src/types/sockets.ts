import {User} from "@/types/users.ts";
import {CompetitionState} from "@/types/competitions.ts";

interface UserGetMeResultEvent {
  event: "USERS:GET_ME:RESULT"
  status: "error" | "success"
  data: User
}

interface NewUserInPlaceEvent {
  event: "USERS:NEW_IN_PLACE"
  status: "error" | "success"
  data: User
}

interface GetUsersInPlaceResultEvent {
  event: "USERS:GET_IN_PLACE:RESULT"
  data: {
    users: User[]
  }
}

interface CompetitionsStateChangeEvent {
  event: "COMPETITIONS:STATE_CHANGE"
  data: {
    state: CompetitionState
  }
}

interface GetCompetitionsStateResultEvent {
  event: "COMPETITIONS:GET_STATE:RESULT",
  data: {
    state: CompetitionState
  }
}

interface UserPlaceUpdateEvent {
  event: "USERS:IN_PLACE_UPDATE"
}

interface UserRegisterResult {
  event: "USERS:REGISTER:RESULT"
  status: "error" | "success"
  data: User
}

interface UserSetPlaceResultEvent {
  event: "USERS:SET_IN_PLACE:RESULT"
  data: {
    user: {
      name: string
      surname: string
    }
  }
}

type EventMessage =
  NewUserInPlaceEvent
  | GetUsersInPlaceResultEvent
  | UserRegisterResult
  | CompetitionsStateChangeEvent
  | UserPlaceUpdateEvent
  | UserSetPlaceResultEvent
  | UserGetMeResultEvent
  | GetCompetitionsStateResultEvent

export type {
  EventMessage,
  NewUserInPlaceEvent,
  GetUsersInPlaceResultEvent,
  UserRegisterResult,
  UserPlaceUpdateEvent,
  UserSetPlaceResultEvent,
  UserGetMeResultEvent,
  GetCompetitionsStateResultEvent,
  CompetitionsStateChangeEvent
}