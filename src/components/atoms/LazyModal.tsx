import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

const Background = styled.div`
  background: #00000080;
  position: fixed;
  inset: 0 0 0 0;

  display: flex;
  justify-content: center;
  align-items: center;
`

type Props = {
  children: ReactNode
  open: boolean
  setOpen: (b: boolean) => void
}

function LazyModal({ children, open, setOpen }: Props) {
  function closeModal() {
    setOpen(false)
  }

  useEffect(() => {
    function closeOnEscapeKey(e: KeyboardEvent) {
      if (e.code === 'Escape') {
        setOpen(false)
      }
    }

    if (open) {
      const bodyStyle = document.body.style
      const scrollY = window.scrollY

      document.addEventListener('keydown', closeOnEscapeKey, false)
      bodyStyle.overflow = 'hidden'
      bodyStyle.position = 'fixed' // For Safari 15
      bodyStyle.top = `-${scrollY}px` // For Safari 15

      return () => {
        document.removeEventListener('keydown', closeOnEscapeKey, false)
        bodyStyle.overflow = ''
        bodyStyle.position = '' // For Safari 15
        bodyStyle.top = '' // For Safari 15
        window.scrollTo(0, scrollY) // For Safari 15
      }
    }
  }, [open, setOpen])

  return open
    ? createPortal(<Background onClick={closeModal}>{children}</Background>, document.body)
    : null
}

export default LazyModal
