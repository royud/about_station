import { useGetAutoCompleteQuery } from "@/apis/getAutoComplete";
import { useGetStationQuery } from "@/apis/getStation";
import ToiletComponent from "@/components/ToiletComponent";
import useDebounce from "@/hook/debounce";
import useInputValue from "@/hook/input_value";
import { theme } from "@/styles/theme";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

export default function Home() {
  const { inputValue, changeValue } = useInputValue();

  const [autoCompleteArr, setAutoCompleteArr] = useState<string[]>([]);

  const [toilet, setToilet] = useState([]);

  const debouncedValue = useDebounce(inputValue, 200);
  const [searchedValue, setSearchedValue] = useState("");

  const [inputFocus, setInputFocus] = useState(false);

  const [isClickButton, setIsClickButton] = useState(false);

  //자동완성
  const autoCompleteData = useGetAutoCompleteQuery(debouncedValue);
  useEffect(() => {
    if (!autoCompleteData) {
      setAutoCompleteArr([]);
    } else {
      setAutoCompleteArr(autoCompleteData.data.autoComplete);
    }
  }, [autoCompleteData]);
  const activeAutoComplete = (list: string) => {
    changeValue(list);
    getStationData(list);
    setAutoCompleteArr([]);
  };

  //역 데이터 불러오기
  const { refetch, data, isLoading, message } =
    useGetStationQuery(searchedValue);
  useEffect(() => {
    if (searchedValue) {
      refetch();
    }
  }, [searchedValue]);
  useEffect(() => {
    if (data && searchedValue) {
      setToilet(data.data.toiletData);
    }
  }, [data, searchedValue]);
  const getStationData = (inputValue: string) => {
    setInputFocus(false);
    setSearchedValue(inputValue);
  };

  return (
    <Wrap>
      <header>
        <h1>about station</h1>
      </header>
      <main>
        <InputSection isClickButton={isClickButton}>
          <div className="inputSectionBox">
            <div className="inputSection">
              <input
                type="text"
                placeholder="ex) 성수"
                value={inputValue}
                onChange={(e: any) => {
                  changeValue(e.target.value);
                }}
                onFocus={() => {
                  setInputFocus(true);
                }}
                onBlur={(e: any) => {
                  if (!e.relatedTarget) {
                    setInputFocus(false);
                  }
                }}
                onKeyDown={(e: any) => {
                  if (!e.nativeEvent.isComposing && e.code === "Enter") {
                    getStationData(inputValue);
                  }
                }}
              />
              <button
                onClick={() => {
                  getStationData(inputValue);
                }}
                onMouseDown={() => {
                  setIsClickButton(true);
                }}
                onMouseUp={() => {
                  setIsClickButton(false);
                }}
              >
                검색
              </button>
            </div>
            {inputFocus && autoCompleteArr.length !== 0 && (
              <ul className="autocomplete">
                {autoCompleteArr.map((list) => {
                  return (
                    <li
                      key={list}
                      onClick={() => {
                        activeAutoComplete(list);
                      }}
                      tabIndex={-1}
                    >
                      {list}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </InputSection>
        <ResultSection>
          {/* 검색어 표시 */}
          {message && <EorrorMessage>{message}</EorrorMessage>}

          {/* 로딩 */}
          {isLoading && (
            <SpinnerContainer>
              <div className="loadingComment">로딩 중</div>
              <div className="spinner">
                <div className="innerCircle"></div>
              </div>
            </SpinnerContainer>
          )}

          {/* 정상 출력 */}
          {data && <ToiletComponent data={toilet} />}
        </ResultSection>
      </main>
    </Wrap>
  );
}

const Wrap = styled.div`
  color: ${theme.textColor.bright};
  background-color: ${theme.backgroundColor.bright};
  max-width: 500px;
  margin: auto;
  header {
    background-color: #8d8d8d;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
  }
  header h1 {
    color: white;
    font-weight: 500;
    font-size: 17px;
    margin-left: 10px;
  }
  main {
    margin: 10px;
  }
  main input {
    padding: 0;
  }
  article {
    margin: 10px 0;
  }
`;
const InputSection = styled.section<{ isClickButton: boolean }>`
  position: relative;
  height: 40px;
  .inputSectionBox {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    border: 1px solid gray;
    border-radius: 25px;
    background-color: white;
  }
  .inputSection {
    height: 40px;
    border-radius: 30px;
    overflow: hidden;
    font-size: 17px;
    display: flex;
    align-items: center;
  }
  input {
    width: 100%;
    height: 100%;
    margin: 10px;
    border: none;
    background-color: transparent;
    outline: none;
  }
  button {
    width: 100px;
    height: 100%;
    color: white;
    margin: 0;
    padding: 0;
    border: none;
    background-color: ${({ isClickButton }) =>
      isClickButton ? "#454545" : "gray"};
    cursor: pointer;
  }
  .autocomplete {
    margin: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .autocomplete li {
    cursor: pointer;
  }
`;
const ResultSection = styled.section`
  .title {
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
  }
`;

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
    background: linear-gradient(#ffffff, #616161);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: ${spinnerAnimation} 2s linear infinite;
  }
  .innerCircle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: white;
  }
  .loadingComment {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }
`;

const EorrorMessage = styled.div`
  margin: 10px 0;
`;
