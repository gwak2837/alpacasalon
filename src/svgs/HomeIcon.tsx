type Props = {
  selected: boolean
}

function HomeIcon({ selected }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      {selected ? (
        <path
          d="M5 21V14H3.27324C2.40313 14 1.94813 12.9657 2.53608 12.3243L11.2628 2.80417C11.6592 2.3718 12.3408 2.3718 12.7372 2.80417L21.4639 12.3243C22.0519 12.9657 21.5969 14 20.7268 14H19V21C19 21.5523 18.5523 22 18 22H15C14.4477 22 14 21.5523 14 21V17H10V21C10 21.5523 9.55229 22 9 22H6C5.44772 22 5 21.5523 5 21Z"
          fill="#7C2F70"
        />
      ) : (
        <path
          d="M5 14H5.5V13.5H5V14ZM10 17V16.5H9.5V17H10ZM14 17H14.5V16.5H14V17ZM19 14V13.5H18.5V14H19ZM2.53608 12.3243L2.1675 11.9864L2.53608 12.3243ZM12.7372 2.80417L12.3686 3.14203L12.7372 2.80417ZM11.2628 2.80417L11.6314 3.14203L11.2628 2.80417ZM21.4639 12.3243L21.0953 12.6621L21.4639 12.3243ZM4.5 14V21H5.5V14H4.5ZM6 22.5H9V21.5H6V22.5ZM10.5 21V17H9.5V21H10.5ZM10 17.5H14V16.5H10V17.5ZM13.5 17V21H14.5V17H13.5ZM15 22.5H18V21.5H15V22.5ZM19.5 21V14H18.5V21H19.5ZM19 14.5H20.7268V13.5H19V14.5ZM21.8325 11.9864L13.1057 2.46631L12.3686 3.14203L21.0953 12.6621L21.8325 11.9864ZM10.8943 2.46631L2.1675 11.9864L2.90466 12.6621L11.6314 3.14203L10.8943 2.46631ZM3.27324 14.5H5V13.5H3.27324V14.5ZM2.1675 11.9864C1.28558 12.9485 1.96808 14.5 3.27324 14.5V13.5C2.83818 13.5 2.61068 12.9828 2.90466 12.6621L2.1675 11.9864ZM13.1057 2.46631C12.5112 1.81775 11.4888 1.81776 10.8943 2.46631L11.6314 3.14203C11.8296 2.92585 12.1704 2.92585 12.3686 3.14203L13.1057 2.46631ZM20.7268 14.5C22.0319 14.5 22.7144 12.9485 21.8325 11.9864L21.0953 12.6621C21.3893 12.9828 21.1618 13.5 20.7268 13.5V14.5ZM13.5 21C13.5 21.8284 14.1716 22.5 15 22.5V21.5C14.7239 21.5 14.5 21.2761 14.5 21H13.5ZM9 22.5C9.82843 22.5 10.5 21.8284 10.5 21H9.5C9.5 21.2761 9.27614 21.5 9 21.5V22.5ZM18 22.5C18.8284 22.5 19.5 21.8284 19.5 21H18.5C18.5 21.2761 18.2761 21.5 18 21.5V22.5ZM4.5 21C4.5 21.8284 5.17157 22.5 6 22.5V21.5C5.72386 21.5 5.5 21.2761 5.5 21H4.5Z"
          fill="#B5B5B5"
        />
      )}
    </svg>
  )
}

export default HomeIcon