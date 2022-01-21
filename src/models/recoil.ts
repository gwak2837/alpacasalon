import { atom } from 'recoil'

export const currentUser = atom({
  key: 'currentUser',
  default: { nickname: '', hasNewNotifications: false },
})

export const commentIdToMoveToAtom = atom({
  key: 'commentIdToMoveTo',
  default: '',
})
