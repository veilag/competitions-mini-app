import {Outlet, useLocation, useNavigate} from "react-router-dom"
import useWebSocket from "react-use-websocket"
import { WS_ROOT } from "@/config/constants"
import {useEffect, useState} from "react"
import HyperText from "@/components/ui/hyper-text.tsx";
import useUserStore from "@/store/user.ts";
import {
  CompetitionsStateChangeEvent,
  EventMessage,
  GetCompetitionsStateResultEvent,
  UserGetMeResultEvent
} from "@/types/sockets.ts";
import {copyToClipboard, impactDoubleHaptic, JsonMessageHandler} from "@/utils";
import {CompetitionState} from "@/types/competitions.ts";
import webapp from "@/webapp";


const ConnectionWrapper = () => {
  const user = useUserStore(state => state.user)
  const setUser = useUserStore(state => state.setUser)
  const navigate = useNavigate()
  const location = useLocation()

  const [competitionState, setCompetitionState] = useState<CompetitionState | undefined>(undefined)
  const [connectionClosed, setConnectionClosed] = useState<boolean>(false)
  
  const { lastJsonMessage, sendJsonMessage } = useWebSocket<EventMessage | null>(
    `${WS_ROOT}/connect_user?token=${encodeURIComponent(
      webapp.initData
    )}`,
    {
      onOpen: () => {
        sendJsonMessage({
          event: "USERS:GET_ME",
          data: null,
        })
      },
      onClose: () => {
        impactDoubleHaptic("heavy")
        setConnectionClosed(true)
      },
      share: true
    }
  )

  const pageStatus =
    (location.pathname === "/" && "Загрузка") ||
    (location.pathname === "/register" && "Регистрация") ||
    (location.pathname === "/profile" && "Добро пожаловать") ||
    (location.pathname === "/admin" && "Админ-панель") ||
    (location.pathname === "/staff_awarding" && "Меню управляющего") ||
    (location.pathname === "/staff" && "Меню управляющего") || undefined

  const color =
    (competitionState?.type === "registration" && "bg-blue-500") ||
    (competitionState?.type === "task_solving" && "bg-green-500") ||
    (competitionState?.type === "start" && "bg-neutral-500") ||
    (competitionState?.type === "awarding" && "bg-red-500") ||
    (competitionState?.type === "checking" && "bg-yellow-500") ||
    (competitionState?.type === "end" && "bg-neutral-500") ||
    ((competitionState?.type === "lunch" || competitionState?.type === "breakfast" || competitionState?.type === "dinner") && "bg-orange-500") ||
    undefined

  const onUserGetMe = (message: UserGetMeResultEvent) => {
    if (message.status === "error") {
      navigate("/register")
      return
    }

    setUser(message.data)

    if (message.data.role.type === "admin") {
      navigate("/admin")
      return
    }

    if (message.data.role.type === "staff") {
      navigate("/staff")
      return
    }

    navigate("/profile")
  }

  const onStateChange = (message: CompetitionsStateChangeEvent | GetCompetitionsStateResultEvent) => {
    setCompetitionState(message.data.state)
    webapp.HapticFeedback
      .impactOccurred("medium")

    if (message.data.state.type === "awarding") {
      if (user?.role.type === "admin") return
      if (user?.role.type === "staff") {
        navigate("/staff_awarding")
        return
      }

      navigate("/awarding")
    }

    if (message.data.state.type !== "awarding") {
      if (user?.role.type === "admin" || user?.role.type === "staff") return
      navigate("/profile")
    }
  }

  useEffect(() => {
    if (lastJsonMessage === null) return

    new JsonMessageHandler(lastJsonMessage)
      .onEvent<UserGetMeResultEvent>("USERS:GET_ME:RESULT", onUserGetMe)
      .onEvent<CompetitionsStateChangeEvent>("COMPETITIONS:STATE_CHANGE", onStateChange)
      .onEvent("COMPETITIONS:GET_STATE:RESULT", onStateChange)
  }, [lastJsonMessage])

  console.log(webapp.platform)

  useEffect(() => {
    if (webapp.initData === "") return
    if (webapp.platform !== "macos" && webapp.platform !== "windows" && webapp.platform !== "web") {
      webapp.expand()
      webapp?.requestFullscreen()
    }

    webapp.HapticFeedback.impactOccurred("medium")

    sendJsonMessage({
      event: "COMPETITIONS:GET_STATE",
      data: null
    })
  }, [])

  if (webapp.initData === "") {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold">Откройте сайт в Telegram</h2>
        <p className="mb-10">Это приложение работает только внутри Telegram</p>

        <a
          className="px-3 py-2 bg-black text-white"
          href="https://t.me/tech_competitions_bot"
        >
          Открыть бота
        </a>
      </div>
    )
  }

  return <>
    <div className="safe_content px-4 pb-5 w-full bg-black text-white">
      <div className="pt-4">
        <HyperText
          className="font-bold text-3xl mb-1"
          text="IT Олимпиады 2024"
        />
        {pageStatus && (
          <HyperText
            className="text-xl"
            text={pageStatus}
          />
        )}
      </div>
    </div>

    {competitionState && (
      <div onClick={() => copyToClipboard((webapp.initData))} className={`w-full text-white py-2 px-4 ${color}`}>
        <HyperText
          text={competitionState.name}
        />
      </div>
    )}

    {connectionClosed && (
      <div className="w-full text-white py-2 px-4 bg-red-500">
        <HyperText
          text="Соединение разорвано"
        />
      </div>
    )}

    {!connectionClosed && (
      <Outlet/>
    )}
  </>
}

export default ConnectionWrapper