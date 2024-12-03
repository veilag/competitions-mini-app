interface User {
  id: number
  public_id: string
  name: string
  surname: string
  in_place: boolean

  role: {
    id: number
    type: string
    name: string
  }

  competition: {
    id: number
    name: string
  } | null
}

export type {
  User
}