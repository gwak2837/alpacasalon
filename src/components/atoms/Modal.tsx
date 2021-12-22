import { ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import XIcon from 'src/svgs/x-white.svg'
import styled from 'styled-components'

const Background = styled.div<{ displayBlock: boolean }>`
  background: #000;
  display: ${(p) => (p.displayBlock ? 'block' : 'none')};
  position: fixed;
  inset: 0 0 0 0;
  z-index: 2;

  > *:not(svg) {
    width: 100%;
    height: 100%;
  }

  > svg {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 3;

    width: 2.2rem;
    padding: 0.6rem;
    cursor: pointer;
  }
`

type Props = {
  children: ReactNode
  open: boolean
  setOpen: (b: boolean) => void
}

function Modal({ children, open, setOpen }: Props) {
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

  return createPortal(
    <Background displayBlock={open} onClick={closeModal}>
      <XIcon onClick={closeModal} />
      {children}
    </Background>,
    document.body
  )
}

export default Modal
