import { ALPACA_SALON_COLOR } from 'src/models/constants'
import styled from 'styled-components'

const Svg = styled.svg`
  width: 1.5rem;
  transform-origin: center;
  animation: rotate 2s linear infinite;

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`

const Circle = styled.circle`
  fill: none;
  stroke: ${ALPACA_SALON_COLOR};
  stroke-width: 3;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dashoffset: -125px;
    }
  }
`

function LoadingSpinner() {
  return (
    <Svg viewBox="25 25 50 50">
      <Circle cx="50" cy="50" r="20"></Circle>
    </Svg>
  )
}

export default LoadingSpinner
