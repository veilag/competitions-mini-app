import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {User} from "@/types/users.ts";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import useWebSocket from "react-use-websocket";
import {EventMessage} from "@/types/sockets.ts";
import {WS_ROOT} from "@/config/constants.ts";
import webapp from "@/webapp";

const AdminSetWinnersView = () => {
  const { lastJsonMessage, sendJsonMessage } = useWebSocket<EventMessage | null>(
    `${WS_ROOT}/connect_user?token=${encodeURIComponent(
      webapp.initData
    )}`, {
      share: true
    }
  )

  const params = useParams()
  const navigate = useNavigate()

  const [users, setUsers] = useState<User[]>([])
  const [place, setPlace] = useState<string>("1")
  const [selectedUserId, setSelectedUserId] = useState<number>(0)

  const competitionName =
    (params.competitionId === "1" && "Искусственный интеллект") ||
    (params.competitionId === "2" && "Программные решения") ||
    (params.competitionId === "3" && "Системное администрирование")

  useEffect(() => {
    if (lastJsonMessage === null) return

    switch (lastJsonMessage.event) {
      case "USERS:GET_ALL:RESULT":
        setUsers(lastJsonMessage.data.users)
        break
    }
  }, [lastJsonMessage])

  const setWinner = () => {
    webapp.HapticFeedback.impactOccurred("medium")

    sendJsonMessage({
      event: "WINNERS:SET_USER",
      data: {
        user_id: selectedUserId,
        place: parseInt(place)
      }
    })
  }

  useEffect(() => {
    sendJsonMessage({
      event: "USERS:GET_ALL",
      data: null
    })
  }, [])

  return (
    <div className="mt-4 px-4 relative z-10">
      <Button className="block w-full mb-3" onClick={() => navigate("/admin")}>Назад</Button>
      {competitionName}

      <div className="mt-10">
        <p className="font-medium text-lg">Установка победителей</p>

        <div className="mt-4">
          <Label>Место</Label>
          <Input value={place} onChange={event => setPlace(event.target.value)} />
        </div>

        <div className="mt-4">
          <Label>Участник</Label>
          <Select onValueChange={value => setSelectedUserId(parseInt(value))}>
            <SelectTrigger id="competitions" className="w-full mt-1 text-base">
              <SelectValue placeholder="Выберите пользователя"/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {users.map(user => (
                  <SelectItem key={user.id} className="text-base" value={`${user.id}`}>{user.surname} {user.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setWinner()} className="mt-4 w-full">Установить победителя</Button>
      </div>
    </div>
  )
}

export default AdminSetWinnersView