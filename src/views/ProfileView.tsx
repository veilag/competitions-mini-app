import {useEffect} from "react";
import {QRCode} from "react-qrcode-logo";
import useWebSocket from "react-use-websocket";
import {WS_ROOT} from "@/config/constants.ts";
import useUserStore from "@/store/user.ts";

const webapp = window.Telegram.WebApp

const ProfileView = () => {
  const user = useUserStore(state => state.user)

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

  useEffect(() => {
    webapp.HapticFeedback.impactOccurred("medium")
  }, [])

  useEffect(() => {
    if (lastJsonMessage === null) return

    switch (lastJsonMessage.event) {
      case "USERS:IN_PLACE_UPDATE":
        webapp.HapticFeedback.impactOccurred("medium")
        webapp.close()
    }
  }, [lastJsonMessage])

  return (
    <div>
      <div className="mt-4 px-4 relative z-10">
        {!user.in_place && (
          <>
            <div className="mt-5 mb-24">
              <div className="mt-5">
                <p className="font-medium text-lg">Привет! Покажи этот QR-код у входа</p>
                <p className="mb-4">
                  Как только ты зайдешь в техникум тебя встретят волонтеры, обязательно покажи им QR-код ниже, чтобы они
                  могли тебя зарегистрировать 😊
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center">
              <QRCode size={200} qrStyle="fluid" value={user?.public_id}/>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProfileView