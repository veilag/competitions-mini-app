import {useEffect, useRef, useState} from "react";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select.tsx";
import useWebSocket from "react-use-websocket";
import {WS_ROOT} from "@/config/constants.ts";
import {useNavigate} from "react-router-dom";

const webapp = window.Telegram.WebApp;

const RegisterView = () => {
  const navigate = useNavigate()

  const nameRef = useRef<HTMLInputElement | null>(null)
  const surnameRef = useRef<HTMLInputElement | null>(null)

  const [roleId, setRoleId] = useState<number>(2)
  const [competitionId, setCompetitionId] = useState<number>(1)

  const { lastJsonMessage, sendJsonMessage } = useWebSocket(
    `${WS_ROOT}/connect_user?token=${encodeURIComponent(
      webapp.initData
    )}`,{
      share: true
    }
  );


  const changeRole = (id: number) => {
    setRoleId(id)
    webapp.HapticFeedback.impactOccurred("light")
  }

  useEffect(() => {
    webapp.HapticFeedback.impactOccurred("medium")

    webapp.MainButton.setText("Зарегистрироваться")
    webapp.MainButton.show()

    webapp.MainButton.onClick(() => {
      sendJsonMessage({
        event: "USERS:REGISTER",
        data: {
          name: nameRef.current?.value,
          surname: surnameRef.current?.value,
          role_id: roleId,
          competition_id: competitionId,
        }
      })

      webapp.HapticFeedback.impactOccurred("light")
      webapp.MainButton.showProgress()
    })
  }, [])

  useEffect(() => {
    if (lastJsonMessage === null) return

    switch (lastJsonMessage.event) {
      case "USERS:REGISTER:RESULT":
        if (lastJsonMessage.status === "error") {
          webapp.showPopup({
            message: "Ошибка регистрации"
          })
        }
        webapp.HapticFeedback.impactOccurred("medium")

        setTimeout(() => {
          webapp.HapticFeedback.impactOccurred("medium")
        }, 100)

        webapp.MainButton.hideProgress()
        webapp.MainButton.hide()
        navigate("/profile")
    }

  }, [lastJsonMessage])

  return (
    <div>
      <div className="mt-4 px-4 relative z-10">
        <p
          className="text-xl font-medium mb-2"
        >Давай знакомиться!</p>
        <p>Заполни все поля ниже корректно и нажми на кнопку <span className="rounded px-1 button-color text-white">Зарегистрироваться</span></p>

        <div className="flex flex-col gap-4 mt-4">
          <div>
            <Label className="text-base">Имя</Label>
            <Input className="mt-1"/>
          </div>

          <div>
            <Label className="text-base">Фамилия</Label>
            <Input className="mt-1"/>
          </div>

          <div>
            <Label className="text-base">Ты?</Label>
            <div className="mt-1 flex gap-2">
              <button onClick={() => changeRole(2)} className={`${roleId === 2 ? 'button-color' : 'bg-black'} text-white transition-all w-full h-10 px-4 py-2 rounded-md text-base block`}>Участник</button>
              <button onClick={() => changeRole(3)} className={`${roleId === 3 ? 'button-color' : 'bg-black'} text-white transition-all w-full h-10 px-4 py-2 rounded-md text-base block`}>Наставник</button>
              <button onClick={() => changeRole(4)} className={`${roleId === 4 ? 'button-color' : 'bg-black'} text-white transition-all w-full h-10 px-4 py-2 rounded-md text-base block`}>Жюри</button>
            </div>
          </div>

          {roleId === 2 && (
            <div>
              <Label className="text-base">Олимпиада</Label>
              <Select onValueChange={value => setCompetitionId(parseInt(value))}>
                <SelectTrigger className="w-full mt-1 text-base">
                  <SelectValue placeholder="Выбери свою олимпиаду"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem className="text-base" value="1">Искусственный интеллект</SelectItem>
                    <SelectItem className="text-base" value="2">Программные решения</SelectItem>
                    <SelectItem className="text-base" value="3">Системное программирование</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegisterView