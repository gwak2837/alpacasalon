import { NextRouter } from 'next/router'
import { KeyboardEvent, MouseEvent } from 'react'

export function stopPropagation(e: MouseEvent<HTMLElement>) {
  e.stopPropagation()
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getUserNickname(router: NextRouter) {
  return ((router.query.userNickname ?? '') as string).slice(1)
}

const urlPattern = new RegExp(
  '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', // fragment locator
  'i'
)

export function isValidUrl(url: string) {
  return !!urlPattern.test(url)
}

export function formatPhoneNumber(phoneNumber: string) {
  const value3 = phoneNumber.replaceAll(' ', '')
  const value2 = value3.replaceAll('+', '')
  const value = value2.replaceAll('-', '')

  if (value.length >= 9) {
    return `+${value.slice(0, 2)} ${value.slice(2, 4)}-${value.slice(4, 8)}-${value.slice(8)}`
  } else if (value.length >= 5) {
    return `+${value.slice(0, 2)} ${value.slice(2, 4)}-${value.slice(4)}`
  } else if (value.length >= 3) {
    return `+${value.slice(0, 2)} ${value.slice(2)}`
  } else {
    return `+${value}`
  }
}

export function isEmpty(object: Record<string, unknown>) {
  for (const key in object) {
    return false
  }
  return true
}

export async function uploadImageFiles(formData: FormData) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
    method: 'POST',
    body: formData,
  })
  return response.json()
}

export function submitWhenShiftEnter(e: KeyboardEvent<HTMLTextAreaElement>) {
  if (e.code === 'Enter' && e.shiftKey) {
    e.preventDefault() // To prevent adding line break when shift+enter pressed
    const submitEvent = new Event('submit', { bubbles: true })
    const parentForm = (e.target as any).form as HTMLFormElement
    parentForm.dispatchEvent(submitEvent)
  }
}

export function isArrayEqual(a?: unknown[] | null, b?: unknown[] | null) {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}
