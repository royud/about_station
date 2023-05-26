import styled, { keyframes } from "styled-components";

export default function SpinnerComponent() {
  return (
    <SpinnerContainer>
      <div className="loadingComment">로딩 중</div>
      <div className="spinner">
        <div className="innerCircle"></div>
      </div>
    </SpinnerContainer>
  );
}

const spinnerAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }

`;
const SpinnerContainer = styled.div`
  width: 100%;
  height: 50vh;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .spinner {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: linear-gradient(
      ${({ theme }) => theme.color.background_main},
      ${({ theme }) => theme.color.background_point}
    );
    display: flex;
    align-items: center;
    justify-content: center;
    animation: ${spinnerAnimation} 2s linear infinite;
  }
  .innerCircle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.color.background_main};
  }
  .loadingComment {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }
`;
