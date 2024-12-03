import {Button} from "@/components/ui/button.tsx";
import useWebSocket from "react-use-websocket";
import {WS_ROOT} from "@/config/constants.ts";
import {useEffect} from "react";
import webapp from "@/webapp";
import {JsonMessageHandler} from "@/utils";
import {EventMessage, UserSetPlaceResultEvent} from "@/types/sockets.ts";

const StaffView = () => {
  const { lastJsonMessage, sendJsonMessage } = useWebSocket<EventMessage | null>(
    `${WS_ROOT}/connect_user?token=${encodeURIComponent(
      webapp.initData
    )}`,
    {
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
    })
  }

  const onUserPlaceUpdate = (message: UserSetPlaceResultEvent) => {
    webapp.showPopup({
      title: `${message.data.user.surname} ${message.data.user.name}`,
      message: 'Поприветствуйте участника'
    })
  }

  useEffect(() => {
    if (lastJsonMessage === null) return

    new JsonMessageHandler(lastJsonMessage)
      .onEvent<UserSetPlaceResultEvent>("USERS:SET_IN_PLACE:RESULT", onUserPlaceUpdate)
  }, [lastJsonMessage])

  return (
    <div>
      <div className="mt-4 px-4 relative z-10">
        <div className="mt-5 mb-5">
          <div className="mt-5">
            <p className="font-medium text-lg">Отметить у входа</p>
            <p className="mb-4">Нажмите на кнопку ниже для открытия сканера QR-кода.<br/><br/>Как только он будет
              наведен на QR-код участника, вы получите сообщение с именем участника, не забудьте его попреветствовать по
              имени</p>

            <Button onClick={showQrScanner} className="w-full text-base">Открыть</Button>
          </div>
        </div>

        <div className="mt-10 mb-5">
          <div className="mt-5">
            <p className="font-medium text-lg">Объявление победителей</p>
            <p className="mb-4">
              Нажимая на кнопку ниже, вы переходите в режим объявления победителей.<br/><br/>
              Этот режим открывает ТОЛЬКО ведущий на сцене. Несанкцианированное объявление пользователей записывается на сервере, поэтому кто решит поиграть пожалеет об этом
            </p>

            <Button className="w-full text-base">Перейти в режим</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffView