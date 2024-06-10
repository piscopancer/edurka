import { proxy } from 'valtio'

export const headerStore = proxy({
  showUserPopup: false,
  showTutorPopup: false,
})
