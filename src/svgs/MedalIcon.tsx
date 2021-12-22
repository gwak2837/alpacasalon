import { ALPACA_SALON_COLOR, ALPACA_SALON_GREY_COLOR } from 'src/models/constants'

type Props = {
  selected: boolean
}

function MedalIcon({ selected }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M14.272 10.445L18 2L14.272 10.445ZM9.316 10.632L5 2L9.316 10.632ZM12.761 10.048L8.835 2L12.761 10.048ZM14.36 2L13.32 4.5L14.36 2ZM6 16C6 17.5913 6.63214 19.1174 7.75736 20.2426C8.88258 21.3679 10.4087 22 12 22C13.5913 22 15.1174 21.3679 16.2426 20.2426C17.3679 19.1174 18 17.5913 18 16C18 14.4087 17.3679 12.8826 16.2426 11.7574C15.1174 10.6321 13.5913 10 12 10C10.4087 10 8.88258 10.6321 7.75736 11.7574C6.63214 12.8826 6 14.4087 6 16V16Z"
        stroke={selected ? ALPACA_SALON_COLOR : ALPACA_SALON_GREY_COLOR}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default MedalIcon
