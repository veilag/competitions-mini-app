import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import useWebSocket from "react-use-websocket";
import {WS_ROOT} from "@/config/constants.ts";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useEffect, useRef, useState} from "react";

const webapp = window.Telegram.WebApp;

const AdminView = () => {
  const [selectedStateId, setSelectedStateId] = useState<number>(0)

  const telegramIdRef = useRef<HTMLInputElement | null>(null)
  const nameRef = useRef<HTMLInputElement | null>(null)
  const surnameRef = useRef<HTMLInputElement | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState<number>(5)

  const { lastJsonMessage, sendJsonMessage } = useWebSocket(
    `${WS_ROOT}/connect_user?token=${encodeURIComponent(
      webapp.initData
    )}`, {
      share: true
    }
  )

  const showQrScanner = () => {
    webapp.showScanQrPopup({
      text: "Сканируйте QR-код участника, не забудьте его поприветствовать"
    }, value => {
      const public_id = value

      sendJsonMessage({
        event: "USERS:SET_IN_PLACE",
        data: {
          public_id
        }
      })

      webapp.closeScanQrPopup()
    })
  }

  const changeStatus = () => {
    sendJsonMessage({
      event: "COMPETITIONS:CHANGE_STATE",
      data: {
        state_id: selectedStateId
      }
    })
  }

  const registerUser = () => {
    webapp.HapticFeedback.impactOccurred("soft")

    sendJsonMessage({
      event: "USERS:REGISTER",
      data: {
        telegram_id: telegramIdRef.current?.value,
        name: surnameRef.current?.value,
        surname: surnameRef.current?.value,
        role_id: selectedRoleId
      }
    })
  }

  useEffect(() => {
    if (lastJsonMessage === null) return

    switch (lastJsonMessage.event) {
      case "USERS:REGISTER:RESULT":
        if (lastJsonMessage.status === "success") {
          webapp.showPopup({
            message: "Успешная регистрация"
          })
        } else {
          webapp.showPopup({
            message: "Регистрация провалена"
          })
        }
        break

      case "USERS:SET_IN_PLACE:RESULT":
        webapp.showPopup({
          title: "Пользователь вошел",
          message: `${lastJsonMessage.data.user.surname} ${lastJsonMessage.data.user.name}`
        })
        break
    }
  }, [lastJsonMessage])

  useEffect(() => {
    webapp.HapticFeedback.impactOccurred("medium")
  }, [])

  return (
    <div>
      <div className="mt-4 px-4 relative z-10">
        <div className="mt-5 mb-5">
          <div>
            <p className="font-medium text-lg">Зарегистрировать пользователя</p>
            <p className="mb-4">Для регистрации пользователя заполните форму ниже</p>

            <div className="flex flex-col gap-3">
              <div>
                <Label>Telegram ID</Label>
                <Input ref={telegramIdRef} className="mt-1"/>
              </div>
              <div>
                <Label>Имя</Label>
                <Input ref={nameRef} className="mt-1"/>
              </div>
              <div>
                <Label>Фамилия</Label>
                <Input ref={surnameRef} className="mt-1"/>
              </div>
              <div>
                <Label>Роль</Label>

                <Select onValueChange={value => setSelectedRoleId(parseInt(value))}>
                  <SelectTrigger className="w-full mt-1 text-base">
                    <SelectValue placeholder="Выберите роль"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem className="text-base" value="2">Участник</SelectItem>
                      <SelectItem className="text-base" value="3">Наставник</SelectItem>
                      <SelectItem className="text-base" value="4">Жюри</SelectItem>
                      <SelectItem className="text-base" value="5">Управляющий</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={registerUser}>Зарегистрировать</Button>
            </div>
          </div>

          <div className="mt-5">
            <p className="font-medium text-lg">Изменить состояние олимпиад</p>
            <p className="mb-4">Выберите состояние и подтвердите выбор</p>

            <div className="mb-3">
              <Select onValueChange={value => setSelectedStateId(parseInt(value))}>
                <SelectTrigger className="w-full mt-1 text-base">
                  <SelectValue placeholder="Выберите состояние"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem className="text-base" value="1">Старт</SelectItem>
                    <SelectItem className="text-base" value="2">Регистрация</SelectItem>
                    <SelectItem className="text-base" value="3">Выполнение заданий</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => changeStatus()} className="w-full">Изменить состояние</Button>
          </div>

          <div className="mt-5">
            <p className="font-medium text-lg">Разное</p>
            <p className="mb-4">Функционал относящийся к разным ролям</p>

            <Button onClick={showQrScanner} className="w-full">Сканировать QR-код</Button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminView