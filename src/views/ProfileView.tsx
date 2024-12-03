import {useEffect} from "react";
import {QRCode} from "react-qrcode-logo";
import useWebSocket from "react-use-websocket";
import {WS_ROOT} from "@/config/constants.ts";
import useUserStore from "@/store/user.ts";
import webapp from "@/webapp";
import {JsonMessageHandler} from "@/utils";
import {EventMessage} from "@/types/sockets.ts";

const ProfileView = () => {
  const user = useUserStore(state => state.user)

  const { lastJsonMessage } = useWebSocket<EventMessage | null>(
    `${WS_ROOT}/connect_user?token=${encodeURIComponent(webapp.initData)}`,
    {
      share: true
    }
  )

  const onUserPlaceUpdate = () => {
    webapp.HapticFeedback.impactOccurred("medium")
    webapp.close()
  }

  useEffect(() => {
    if (lastJsonMessage === null) return

    new JsonMessageHandler(lastJsonMessage)
      .onEvent("USERS:PLACE_UPDATE", onUserPlaceUpdate)
  }, [lastJsonMessage])

  useEffect(() => {
    webapp.HapticFeedback.impactOccurred("medium")
  }, [])

  return (
    <div>
      <div className="mt-4 px-4 relative z-10">
        {!user?.in_place && (
          <>
            <div className="mt-5 mb-24">
              <div className="mt-5">
                <p className="font-medium text-lg">Привет! Кажется, ты еще не на мероприятии</p>
                <p className="mb-4">
                  Как только ты зайдешь в техникум тебя встретят волонтеры, обязательно покажи им QR-код ниже, чтобы они
                  могли тебя зарегистрировать 😊
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center mb-10">
              <QRCode size={200} qrStyle="fluid" value={user?.public_id}/>
            </div>
          </>
        )}

        {user?.in_place && (
          <div className="mt-5">
            <p className="font-medium text-lg">Привет, {user.name}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileView