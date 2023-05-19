import styled from "styled-components";

const ListCard = ({ list }: { list: any }) => {
  return (
    <StyleCard key={list.lineNum}>
      <div className="lineName">{list.lineName}</div>
      {list.lineArr.map((toiletList: any) => {
        return (
          <div className="toiletList" key={toiletList.location}>
            <div>위치 : {toiletList.location}</div>
            <div>게이트 안팎 유무 : {toiletList.inAndOut}</div>
          </div>
        );
      })}
    </StyleCard>
  );
};

export default function ToiletComponent({ data }: { data: any }) {
  return (
    <article className="toilet">
      <div className="title">화장실 정보</div>
      {data.map((list: any) => (
        <ListCard key={data.indexOf(list)} list={list} />
      ))}
    </article>
  );
}

const StyleCard = styled.div`
  margin-bottom: 10px;
  .lineName {
    font-weight: bold;
  }
  .toiletList {
    margin-bottom: 5px;
  }
`;
