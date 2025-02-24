import React from 'react';
import styled from 'styled-components';

const Card = ({ title, name, $bgColor1, $bgColor2, $bgColor3, $delay }) => {
  return (
    <StyledWrapper $delay={$delay} $bgColor1={$bgColor1} $bgColor2={$bgColor2} $bgColor3={$bgColor3}>
      <div className="e-card playing">
        <div className="image" />
        <div className="wave" />
        <div className="wave" />
        <div className="wave" />
        <div className="infotop">     
          {title}
          <div className="name">{name}</div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .e-card {
    width: 200px;
    height: 200px;
    border-radius: 100px;
    overflow: hidden;
    animation: bop 2s infinite ease-in-out;
    animation-delay: ${({ $delay }) => $delay};
  }

  .wave {
    position: absolute;
    width: 540px;
    height: 700px;
    opacity: 0.6;
    left: 0;
    top: 0;
    margin-left: -50%;
    margin-top: -70%;
    background: linear-gradient(744deg, ${({ $bgColor1 }) => $bgColor1}, ${({ $bgColor2 }) => $bgColor2} 60%, ${({ $bgColor3 }) => $bgColor3});
  }

  .infotop {
    text-align: center;
    font-size: 100px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    color: rgba(245, 245, 245, 1);
    font-weight: 800;
    text-shadow: 4px 4px 8px rgba(47, 36, 36, 1);
  }

  .name {
    font-size: 20px;
    font-weight: 800;
    position: relative;
    bottom: 20px;
  }

  .wave:nth-child(2),
  .wave:nth-child(3) {
    top: 210px;
  }

  .playing .wave {
    border-radius: 40%;
    animation: wave 3000ms infinite linear;
  }

  .wave {
    border-radius: 40%;
    animation: wave 55s infinite linear;
  }

  .playing .wave:nth-child(2) {
    animation-duration: 4000ms;
  }

  .wave:nth-child(2) {
    animation-duration: 50s;
  }

  .playing .wave:nth-child(3) {
    animation-duration: 5000ms;
  }

  .wave:nth-child(3) {
    animation-duration: 45s;
  }

  @keyframes wave {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes bop {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;


export default Card;
