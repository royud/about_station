import styled from "styled-components";

const ListCard = ({ list }: { list: any }) => {
  return (
    <StyleCard key={list.lineNum}>
      <div className="lineName">{list.lineName}</div>
      <ul>
        {list.lineArr.map((toiletList: any) => {
          return (
            <li className="toiletList" key={toiletList.toiletId}>
              <div className="menu">위치</div>
              <div className="desc">{toiletList.location}</div>
              <div className="menu">게이트 안팎 유무</div>
              <div className="desc">{toiletList.inAndOut}</div>
              <div className="menu">종류 유무</div>
              <div className="desc">{toiletList.MaleOrFemale}</div>
              {toiletList.etc !== "null" && (
                <>
                  <div className="menu">참고사항</div>
                  <div className="desc">{toiletList.etc}</div>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </StyleCard>
  );
};

export default function ToiletComponent({ data }: { data: any }) {
  return (
    <Wrap>
      <div className="title">화장실 정보</div>
      {data.map((list: any) => (
        <ListCard key={data.indexOf(list)} list={list} />
      ))}
    </Wrap>
  );
}

const Wrap = styled.article`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyleCard = styled.div`
  background-color: ${({ theme }) => theme.color.background_point};
  padding: 10px;
  border-radius: 10px;

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 5%;
  }
  .lineName {
    font-weight: bold;
    font-size: 18px;
  }
  .toiletList {
    margin-bottom: 10px;
    width: 45%;
  }
  .menu {
    font-weight: bold;
    font-size: 16px;
  }
  .desc {
    white-space: pre-wrap;
    margin-bottom: 5px;
  }
`;
