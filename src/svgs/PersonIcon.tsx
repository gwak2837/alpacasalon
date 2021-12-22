import { ALPACA_SALON_COLOR, ALPACA_SALON_GREY_COLOR } from 'src/models/constants'

type Props = {
  selected: boolean
}

function PersonIcon({ selected }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M12.5 2C6.977 2 2.5 6.477 2.5 12C2.5 17.523 6.977 22 12.5 22C18.023 22 22.5 17.523 22.5 12C22.5 6.477 18.023 2 12.5 2Z"
        stroke={selected ? ALPACA_SALON_COLOR : ALPACA_SALON_GREY_COLOR}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.771 18.346C4.771 18.346 7 15.5 12.5 15.5C18 15.5 20.23 18.346 20.23 18.346"
        stroke={selected ? ALPACA_SALON_COLOR : ALPACA_SALON_GREY_COLOR}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 12C13.2956 12 14.0587 11.6839 14.6213 11.1213C15.1839 10.5587 15.5 9.79565 15.5 9C15.5 8.20435 15.1839 7.44129 14.6213 6.87868C14.0587 6.31607 13.2956 6 12.5 6C11.7044 6 10.9413 6.31607 10.3787 6.87868C9.81607 7.44129 9.5 8.20435 9.5 9C9.5 9.79565 9.81607 10.5587 10.3787 11.1213C10.9413 11.6839 11.7044 12 12.5 12V12Z"
        stroke={selected ? ALPACA_SALON_COLOR : ALPACA_SALON_GREY_COLOR}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default PersonIcon
