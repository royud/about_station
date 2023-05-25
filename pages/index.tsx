import { useGetAutoCompleteQuery } from "@/apis/getAutoComplete";
import { useGetStationQuery } from "@/apis/getStation";
import SpinnerComponent from "@/components/SpinnerComponent";
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
        </InputSection>
        <ResultSection>
          {/* 검색어 표시 */}
          {message && <ApiMessage>{message}</ApiMessage>}

          {/* 로딩 */}
          {isLoading && <SpinnerComponent />}

          {/* 정상 출력 */}
          {data && <ToiletComponent data={toilet} />}
        </ResultSection>
      </main>
    </Wrap>
  );
}

const Wrap = styled.div`
  color: ${theme.bright.textColor};
  background-color: ${theme.bright.backgroundColor};
  max-width: 500px;
  margin: auto;
  header {
    background-color: ${theme.bright.pointColor};
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
  }
  header h1 {
    color: ${theme.bright.textColor2};
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
  height: 40px;
  .inputSectionBox {
    width: 100%;
    border: 2px solid ${theme.bright.pointColor};
    border-radius: 25px;
    background-color: ${theme.bright.backgroundColor};
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
    color: ${theme.bright.textColor2};
    margin: 0;
    padding: 0;
    border: 1px solid ${theme.bright.pointColor};
    background-color: ${({ isClickButton }) =>
      isClickButton ? theme.bright.pointColorDark : theme.bright.pointColor};
    cursor: pointer;
  }
  .autocomplete {
    width: calc(100% - 100px - 20px);
    position: relative;
    top: 10px;
    left: 0;
    padding: 20px;
    border: 2px solid ${theme.bright.pointColor};
    border-radius: 20px;
    background-color: ${theme.bright.backgroundColor};
    color: ${theme.bright.textColor};
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
const ApiMessage = styled.div`
  margin: 10px 0;
`;
