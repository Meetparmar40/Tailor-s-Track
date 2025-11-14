import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader-container">
        <div style={{
          '--size': '48px',
          '--dot-size': '5px',
          '--dot-count': 6,
          '--color': 'hsl(var(--primary))',
          '--speed': '1.2s',
          '--spread': '60deg'
        }} className="dots">
          <div style={{'--i': 0}} className="dot" />
          <div style={{'--i': 1}} className="dot" />
          <div style={{'--i': 2}} className="dot" />
          <div style={{'--i': 3}} className="dot" />
          <div style={{'--i': 4}} className="dot" />
          <div style={{'--i': 5}} className="dot" />
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 120px;
    width: 100%;
    padding: 2rem;
    position: relative;
  }

  .dots {
    width: var(--size);
    height: var(--size);
    position: relative;
  }

  .dot {
    width: var(--size);
    height: var(--size);
    animation: dwl-dot-spin calc(var(--speed) * 5) infinite linear both;
    animation-delay: calc(var(--i) * var(--speed) / (var(--dot-count) + 2) * -1);
    rotate: calc(var(--i) * var(--spread) / (var(--dot-count) - 1));
    position: absolute;
  }

  .dot::before {
    content: "";
    display: block;
    width: var(--dot-size);
    height: var(--dot-size);
    background-color: var(--color);
    border-radius: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    bottom: 0;
    left: 50%;
    box-shadow: 0 0 8px hsla(var(--primary), 0.3);
  }

  @keyframes dwl-dot-spin {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.390, 0.575, 0.565, 1.000);
      opacity: 0.9;
    }

    2% {
      transform: rotate(20deg);
      animation-timing-function: linear;
      opacity: 0.9;
    }

    30% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.445, 0.050, 0.550, 0.950);
      opacity: 0.9;
    }

    41% {
      transform: rotate(380deg);
      animation-timing-function: linear;
      opacity: 0.9;
    }

    69% {
      transform: rotate(520deg);
      animation-timing-function: cubic-bezier(0.445, 0.050, 0.550, 0.950);
      opacity: 0.9;
    }

    76% {
      opacity: 0.9;
    }

    76.1% {
      opacity: 0.4;
    }

    80% {
      transform: rotate(720deg);
    }

    100% {
      opacity: 0.2;
    }
  }

  /* Dark mode support */
  .dark & {
    .dot::before {
      box-shadow: 0 0 10px hsla(var(--primary), 0.5);
    }
  }

  /* Responsive sizing */
  @media (max-width: 768px) {
    .loader-container {
      min-height: 80px;
      padding: 1.5rem;
    }

    .dots {
      --size: 40px !important;
      --dot-size: 4px !important;
    }
  }

  @media (max-width: 480px) {
    .loader-container {
      min-height: 60px;
      padding: 1rem;
    }

    .dots {
      --size: 32px !important;
      --dot-size: 3px !important;
    }
  }
`;

export default Loader;