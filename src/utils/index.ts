import webapp from "@/webapp";
import {EventMessage} from "@/types/sockets.ts";

class JsonMessageHandler {
  private readonly message: EventMessage

  constructor(message: EventMessage) {
    this.message = message
  }

  onEvent<T extends EventMessage>(eventName: T["event"], callback: (message: T) => void) {
    if (this.message?.event === eventName) {
      callback(this.message as T)
    }
    return this
  }
}

const impactDoubleHaptic = (type: "soft" | "light" | "medium" | "heavy") => {
  webapp.HapticFeedback.impactOccurred(type)

  setTimeout(() => {
    webapp.HapticFeedback.impactOccurred(type)
  }, 100)
}

const showMainButton = (title: string) => {
  webapp.MainButton.setText(title)
  webapp.MainButton.show()
}

export {
  impactDoubleHaptic,
  showMainButton,
  JsonMessageHandler
}