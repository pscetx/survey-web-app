import React from 'react';
import styled from 'styled-components';

const Button2 = () => {
  return (
    <StyledWrapper>
      <button>
        <span>TRA CỨU</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 74 74" height={34} width={34}>
          <circle strokeWidth={1.5} stroke="black" r="35.5" cy={37} cx={37} />
          <path fill="black" d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z" />
        </svg>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    cursor: pointer;
    font-weight: 600;
    color: #2f2424;
    transition: all 0.5s;
    padding: 8px 16px;
    border-radius: 12px;
    background: #ffffff;
    border: 2px solid #2f2424;
    display: flex;
    align-items: center;
    font-size: 22px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  button:hover {
    color: #b10913;
    letter-spacing: 1.2px;
  }

  button > svg {
    width: 34px;
    margin-left: 10px;
    transition: transform 0.3s ease-in-out;
  }

  button:hover svg {
    transform: translateX(5px);
  }

  button:active {
    transform: scale(0.95);
  }`;

export default Button2;
