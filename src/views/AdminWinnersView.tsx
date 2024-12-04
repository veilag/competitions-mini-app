import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import useWebSocket from "react-use-websocket";
import {EventMessage} from "@/types/sockets.ts";
import {WS_ROOT} from "@/config/constants.ts";
import webapp from "@/webapp";
import {Button} from "@/components/ui/button.tsx";
import {User} from "@/types/users.ts";

const AdminWinnersView = () => {
  const navigate = useNavigate()

  const { lastJsonMessage, sendJsonMessage } = useWebSocket<EventMessage | null>(
    `${WS_ROOT}/connect_user?token=${encodeURIComponent(
      webapp.initData
    )}`, {
      share: true
    }
  )

  const params = useParams()
  const [winners, setWinners] = useState<User[]>([])
  const [nominationWinners, setNominationWinners] = useState<User[]>([])

  const competitionName =
    (params.competitionId === "1" && "Искусственный интеллект") ||
    (params.competitionId === "2" && "Программные решения") ||
    (params.competitionId === "3" && "Системное администрирование")

  const revealWinnerPlace = (place: number) => {
    webapp.HapticFeedback.impactOccurred("medium")
    sendJsonMessage({
      event: "WINNERS:REVEAL_COMPETITION_WINNER",
      data: {
        competition_id: parseInt(params.competitionId as string),
        place: place
      }
    })
  }

  const revealNominationWinner = (name: string) => {
    webapp.HapticFeedback.impactOccurred("medium")
    sendJsonMessage({
      event: "WINNERS:REVEAL_COMPETITION_NOMINATION_WINNER",
      data: {
        competition_id: parseInt(params.competitionId as string),
        name: name
      }
    })
  }

  useEffect(() => {
    if (lastJsonMessage === null) return

    switch (lastJsonMessage.event) {
      case "WINNERS:GET_PLACES:RESULT":
        setWinners(lastJsonMessage.data.winners)
        break

      case "WINNERS:GET_NOMINATIONS:RESULT":
        setNominationWinners(lastJsonMessage.data.winners)
        break
    }

  }, [lastJsonMessage])

  useEffect(() => {
    sendJsonMessage({
      event: "WINNERS:GET_PLACES",
      data: {
        competition_id: parseInt(params.competitionId as string)
      }
    })

    sendJsonMessage({
      event: "WINNERS:GET_NOMINATIONS",
      data: {
        competition_id: parseInt(params.competitionId as string)
      },
    })
  }, []);

  return (
    <div className="mt-4 px-4 relative z-10">
      <Button className="block w-full mb-3" onClick={() => navigate("/admin")}>Назад</Button>
      <p className="text-lg font-medium">{competitionName}</p>

      <div className="mt-2">
        <p className="font-medium mb-2">Победители</p>
        <ul>
          {winners.map(winner => (
            <li className="p-2 bg-neutral-200 rounded-md">
              <p>{winner.user.surname} {winner.user.name}</p>
              <p>{winner.place} место</p>
              <Button className="mt-2 w-full" onClick={() => revealWinnerPlace(winner.place)}>Раскрыть</Button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-2">
        <p className="font-medium mb-2">Номинации</p>
        <ul>
          {nominationWinners.map(nominationWinner => (
            <li className="p-2 bg-neutral-200 rounded-md">
              <p>{nominationWinner.user.surname} {nominationWinner.user.name}</p>
              <p>{nominationWinner.name}</p>
              <Button className="mt-2 w-full" onClick={() => revealNominationWinner(nominationWinner.name)}>Раскрыть</Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AdminWinnersView