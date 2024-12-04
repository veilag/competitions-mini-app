import useWebSocket from "react-use-websocket";
import {EventMessage} from "@/types/sockets.ts";
import {WS_ROOT} from "@/config/constants.ts";
import webapp from "@/webapp";
import {useEffect, useState} from "react";
import ConfettiExplosion from "react-confetti-explosion";
import HyperText from "@/components/ui/hyper-text.tsx";
import {impactDoubleHaptic} from "@/utils";

const AwardingView = () => {
  const [explodeShowed, setExplodeShowed] = useState<boolean>(false)
  const [competitions, setCompetitions] = useState([])
  const [winners, setWinners] = useState([])
  const [nominationWinners, setNominationWinners] = useState([])

  const { lastJsonMessage } = useWebSocket<EventMessage | null>(
    `${WS_ROOT}/connect_user?token=${encodeURIComponent(
      webapp.initData
    )}`, {
      share: true
    }
  )

  useEffect(() => {
    if (lastJsonMessage === null) return

    switch (lastJsonMessage.event) {
      case "WINNERS:TOKE_PLACE":
        setExplodeShowed(true)
        impactDoubleHaptic("heavy")
        break

      case "WINNERS:NOMINATION_TOKE_PLACE":
        setExplodeShowed(true)
        impactDoubleHaptic("heavy")
        break

      case "WINNERS:PLACE_REVEAL":
        if (!competitions.find(competition => competition.id === lastJsonMessage.data.competition_id)) {
          setCompetitions(prev => ([...prev, {
            id: lastJsonMessage.data.competition_id,
            name: lastJsonMessage.data.winner.user.competition.name
          }]))
        }

        setWinners(prev => ([...prev, {
          competition_id: lastJsonMessage.data.competition_id,
          place: lastJsonMessage.data.place,
          winner: lastJsonMessage.data.winner
        }]))
        break

      case "WINNERS:NOMINATION_REVEAL":
        if (!competitions.find(competition => competition.id === lastJsonMessage.data.competition_id)) {
          setCompetitions(prev => ([...prev, {
            id: lastJsonMessage.data.competition_id,
            name: lastJsonMessage.data.winner.user.competition.name
          }]))
        }

        setNominationWinners(prev => ([...prev, {
          competition_id: lastJsonMessage.data.competition_id,
          name: lastJsonMessage.data.name,
          winner: lastJsonMessage.data.winner
        }]))
        break
    }
  }, [lastJsonMessage])

  return (
    <>
    {explodeShowed && <ConfettiExplosion zIndex={1000} />}

    <div className="mt-4 px-4 relative z-10">
      {competitions.length === 0 && (
        <div className="mt-5 mb-5">
          <div className="mt-5">
            <p className="font-medium text-lg">Совсем скоро объявят победителей!</p>
            <p className="mb-4">
              Если победителем окажешься ты, мы тебе об этом сообщим!<br/><br/>
              А пока, следим за ведущим ⚡️
            </p>
          </div>
        </div>
      )}

      <div>
        <ul className="flex flex-col gap-5">
          {competitions.map(competition => (
            <li key={competition.id}>
              <div className="w-full bg-blue-500 px-2 rounded py-1">
                <HyperText
                  className="text-lg font-medium text-white"
                  text={competition.name}
                />
              </div>

              <ul className="flex mt-3 flex-col gap-3">
                {winners.map(winner => {
                  if (winner.winner.user.competition.id === competition.id) {
                    return (
                      <li>
                        <HyperText
                          className="text-xl"
                          text={`${winner.winner.user.surname} ${winner.winner.user.name}`}
                        />
                        <p className="text-lg">{winner.winner.place} Место</p>
                      </li>
                    )
                  }
                })}
              </ul>

              <ul className="flex mt-4 flex-col gap-3">
                {nominationWinners.map(winner => {
                  if (winner.winner.user.competition.id === competition.id) {
                    return (
                      <li>
                        <HyperText
                          className="text-xl"
                          text={`${winner.winner.user.surname} ${winner.winner.user.name}`}
                        />
                        <p className="text-lg">{winner.winner.name}</p>
                      </li>
                    )
                  }
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </>
  )
}

export default AwardingView