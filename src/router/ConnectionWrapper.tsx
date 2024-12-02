import {Outlet, useLocation, useNavigate} from "react-router-dom"
import useWebSocket from "react-use-websocket"
import { WS_ROOT } from "@/config/constants"
import {useEffect, useState} from "react"
import HyperText from "@/components/ui/hyper-text.tsx";
import useUserStore from "@/store/user.ts";

const webapp = window.Telegram.WebApp

const ConnectionWrapper = () => {
  const setUser = useUserStore(state => state.setUser)
  const navigate = useNavigate()
  const location = useLocation()

  const [status, setStatus] = useState({
    name: "Начало олимпиады",
    type: "start"
  })

  const { lastJsonMessage, sendJsonMessage } = useWebSocket(
    `${WS_ROOT}/connect_user?token=${encodeURIComponent(
      webapp.initData
    )}`,
    {
      onOpen: () => {
        sendJsonMessage({
          event: "USERS:GET_ME",
          data: null,
        });
      },
      share: true
    }
  );

  let pageStatus;
  let color;

  if (status.type === "registration") {
    color = 'bg-blue-500'

  } else if (status.type === "task_solving") {
    color = 'bg-green-500'

  } else if (status.type === "start") {
    color = 'bg-neutral-500'
  }

  if (location.pathname === "/register") {
    pageStatus = "Регистрация"

  } else if (location.pathname === "/") {
    pageStatus = "Загрузка"

  } else if (location.pathname === "/profile") {
    pageStatus = "Добро пожаловать!"

  } else if (location.pathname === "/admin") {
    pageStatus = "Админ-панель"

  } else if (location.pathname === "/staff") {
    pageStatus = "Меню управляющего"
  }

  useEffect(() => {
    if (lastJsonMessage === null) return

    switch (lastJsonMessage.event) {
      case "USERS:GET_ME:RESULT":
        if (lastJsonMessage.status === "error") {
          navigate("/register")
        } else {
          setUser(lastJsonMessage.data)

          if (lastJsonMessage.data.role.type === "admin") {
            navigate("/admin")
            return
          }

          if (lastJsonMessage.data.role.type === "staff") {
            navigate("/staff")
            return
          }

          navigate("/profile")
        }
        break

      case "COMPETITIONS:STATE_CHANGE":
        setStatus(lastJsonMessage.data.state)
        webapp.HapticFeedback
          .impactOccurred("medium")

        break

      case "USERS:REGISTER:RESULT":
        setUser(lastJsonMessage.data)
        break
    }

  }, [lastJsonMessage])

  useEffect(() => {
    if (webapp.initData === "") return
    webapp.requestFullscreen()
    webapp.HapticFeedback.impactOccurred("medium")
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
    <div className="container px-4 pb-5 w-full bg-black text-white">
      <div className="pt-4">
        <HyperText
          className="font-bold text-3xl mb-1"
          text="IT Олимпиады 2024"
        />
        <HyperText
          className="text-xl"
          text={pageStatus}
        />
      </div>
    </div>
    <div className={`w-full text-white py-2 px-4 ${color}`}>
      <HyperText
        text={status.name}
      />
    </div>
    <Outlet/>
  </>
}

export default ConnectionWrapper