interface ScanQrPopupParams {
  text: string
}

interface PopupButton {
  id?: string
  type?: "default" | "ok" | "close" | "cancel" | "destructive"
  text?: string
}

interface PopupParams {
  title?: string
  message: string
  buttons?: PopupButton[]
}

interface HapticFeedback {
  impactOccurred: (type: string) => void
}

interface BottomButton {
  show: () => void
  showProgress: () => void

  onClick: (callback?: () => void) => void
  offClick: (callback?: () => void) => void
  setText: (value: string) => void

  hideProgress: () => void
  hide: () => void
}

interface WebApp {
  initData: string
  HapticFeedback: HapticFeedback
  MainButton: BottomButton

  platform: string

  showPopup: (params: PopupParams, callback?: (buttonId: string) => void) => void
  showScanQrPopup: (params: ScanQrPopupParams, callback: (value: string) => void) => void

  requestFullscreen: () => void
  expand: () => void
  close: () => void
}

export type {
  WebApp,
}