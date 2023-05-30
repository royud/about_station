import { useGetAutoCompleteQuery } from "@/apis/getAutoComplete";
import { useGetStationQuery } from "@/apis/getStation";
import SpinnerComponent from "@/components/SpinnerComponent";
import ToiletComponent from "@/components/ToiletComponent";
import useDebounce from "@/hook/debounce";
import useInputValue from "@/hook/input_value";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { CustomThemeContext } from "./_app";
import Link from "next/link";

export default function Home() {
  const { inputValue, changeValue } = useInputValue();

  const [autoCompleteArr, setAutoCompleteArr] = useState<string[]>([]);

  const [toilet, setToilet] = useState([]);

  const debouncedValue = useDebounce(inputValue, 200);
  const [searchedValue, setSearchedValue] = useState("");

  const [inputFocus, setInputFocus] = useState(false);

  const [isClickButton, setIsClickButton] = useState(false);

  //다크모드
  const { theme, changeTheme } = useContext(CustomThemeContext);

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
        <Link href={"/"} className="headerWrap">
          <img src="/logo.png" />
          <h1>Toilet Gate</h1>
        </Link>
        <button onClick={changeTheme}>{theme}</button>
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
  color: ${({ theme }) => theme.color.text_main};
  background-color: ${({ theme }) => theme.color.background_main};
  height: 100vh;
  max-width: 500px;
  margin: auto;
  header {
    background-color: ${({ theme }) => theme.color.background_point};
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 0px 0px 10px 10px;
  }
  .headerWrap {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
  .headerWrap img {
    width: 30px;
    height: 30px;
  }
  header h1 {
    color: ${({ theme }) => theme.color.text_sub};
    font-weight: 600;
    font-size: 17px;
    margin-left: 10px;
  }
  header button {
    margin-right: 10px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: ${({ theme }) => theme.color.border_sub};
    background-color: ${({ theme }) => theme.color.background_point};
    color: ${({ theme }) => theme.color.text_sub};
    font-size: 10px;
    cursor: pointer;
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
    border: ${({ theme }) => theme.color.border_point};
    border-radius: 25px;
    background-color: ${({ theme }) => theme.color.background_main};
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
    color: ${({ theme }) => theme.color.text_main};
  }
  button {
    width: 100px;
    height: 100%;
    color: ${({ theme }) => theme.color.text_main};
    margin: 0;
    padding: 0;
    border: ${({ theme }) => theme.color.border_point};
    background-color: ${({ theme }) => theme.color.background_point};
    cursor: pointer;
  }
  .autocomplete {
    width: calc(100% - 100px - 20px);
    position: relative;
    top: 10px;
    left: 0;
    padding: 20px;
    border-radius: 20px;
    background-color: ${({ theme }) => theme.color.background_point};
    box-shadow: 0px 0px 5px 0px black;
    color: ${({ theme }) => theme.color.text_main};
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
