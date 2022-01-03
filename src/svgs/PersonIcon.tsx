import { ALPACA_SALON_COLOR, ALPACA_SALON_GREY_COLOR } from 'src/models/constants'

type Props = {
  hasNewNotifications: boolean
  selected: boolean
}

function PersonIcon({ hasNewNotifications, selected }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      {selected ? (
        <>
          <path
            d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
            stroke={ALPACA_SALON_COLOR}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.271 18.346C4.271 18.346 6.5 15.5 12 15.5C17.5 15.5 19.73 18.346 19.73 18.346"
            fill={ALPACA_SALON_COLOR}
          />
          <path
            d="M4.271 18.346C4.271 18.346 6.5 15.5 12 15.5C17.5 15.5 19.73 18.346 19.73 18.346"
            stroke="#7C2F70"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 18C4 18 6.30701 21 11.9995 21C17.692 21 20 18 20 18"
            fill={ALPACA_SALON_COLOR}
          />
          <path
            d="M4 18C4 18 6.30701 21 11.9995 21C17.692 21 20 18 20 18"
            stroke={ALPACA_SALON_COLOR}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 12C12.7956 12 13.5587 11.6839 14.1213 11.1213C14.6839 10.5587 15 9.79565 15 9C15 8.20435 14.6839 7.44129 14.1213 6.87868C13.5587 6.31607 12.7956 6 12 6C11.2044 6 10.4413 6.31607 9.87868 6.87868C9.31607 7.44129 9 8.20435 9 9C9 9.79565 9.31607 10.5587 9.87868 11.1213C10.4413 11.6839 11.2044 12 12 12V12Z"
            fill={ALPACA_SALON_COLOR}
            stroke={ALPACA_SALON_COLOR}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <path
            d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
            stroke={ALPACA_SALON_GREY_COLOR}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.271 18.346C4.271 18.346 6.5 15.5 12 15.5C17.5 15.5 19.73 18.346 19.73 18.346"
            stroke={ALPACA_SALON_GREY_COLOR}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 12C12.7956 12 13.5587 11.6839 14.1213 11.1213C14.6839 10.5587 15 9.79565 15 9C15 8.20435 14.6839 7.44129 14.1213 6.87868C13.5587 6.31607 12.7956 6 12 6C11.2044 6 10.4413 6.31607 9.87868 6.87868C9.31607 7.44129 9 8.20435 9 9C9 9.79565 9.31607 10.5587 9.87868 11.1213C10.4413 11.6839 11.2044 12 12 12V12Z"
            stroke={ALPACA_SALON_GREY_COLOR}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {hasNewNotifications && (
        <path
          d="M19 8C19.7956 8 20.5587 7.68393 21.1213 7.12132C21.6839 6.55871 22 5.79565 22 5C22 4.20435 21.6839 3.44129 21.1213 2.87868C20.5587 2.31607 19.7956 2 19 2C18.2044 2 17.4413 2.31607 16.8787 2.87868C16.3161 3.44129 16 4.20435 16 5C16 5.79565 16.3161 6.55871 16.8787 7.12132C17.4413 7.68393 18.2044 8 19 8Z"
          fill={ALPACA_SALON_COLOR}
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

export default PersonIcon
