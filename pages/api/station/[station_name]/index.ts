import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import readXlsxFile from "read-excel-file/node";

type Data = {
  message: string;
  lineNumArr: number[];
  lineData: {
    trainNum: number;
    lineNum: number;
    direction: string;
    currentLocation: string;
    destination: string;
    limit: string;
  }[];
  toiletData: {
    lineNum: string;
    lineName: string;
    location: string;
    inAndOut: string;
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const key = process.env.NEXT_PUBLIC_STATION_KEY;
  const { station_name } = req.query;

  const result = await axios.get(
    `${process.env.NEXT_PUBLIC_OPEN_STATION}/${key}/json/realtimeStationArrival/0/25/${station_name}`
  );

  const lineFilter = [
    "1001",
    "1002",
    "1003",
    "1004",
    "1005",
    "1006",
    "1007",
    "1008",
    "1009",
  ];

  const openTrainList = result.data.realtimeArrivalList;

  const lineNumArr = result.data.realtimeArrivalList[0].subwayList
    .split(",")
    .filter((list: string) => lineFilter.includes(list));
  for (let i = 0; i < lineNumArr.length; i++) {
    const lineNum = Number(lineNumArr[i].split("")[3]);
    lineNumArr.splice(i, 1, lineNum);
  }

  const lineData = [];
  for (let i = 0; i < openTrainList.length; i++) {
    const limit = Number(openTrainList[i].barvlDt);

    //도착 시간을 변환
    let limitChange = "0";
    if (limit > 60) {
      limitChange = `${Math.floor(limit / 60)}분 후 도착`;
    } else if (limit <= 0) {
      limitChange = "도착";
    } else {
      limitChange = `${limit}초 후 도착`;
    }

    const trainData = {
      trainNum: openTrainList[i].btrainNo,
      lineNum: Number(openTrainList[i].subwayId.split("")[3]),
      direction: openTrainList[i].updnLine,
      currentLocation: `현재 ${openTrainList[i].arvlMsg3}역`,
      destination: `${openTrainList[i].bstatnNm}행`,
      limit: limitChange,
    };

    lineData.push(trainData);
  }

  // --------------------------------------------------------------------------
  const toiletKey = process.env.NEXT_PUBLIC_TOILET_KEY;

  const toiletArr = [];
  const getStationData = await readXlsxFile(
    `${__dirname}/../../../../../xlsx/운영기관_역사_코드정보_2023.02.22.xlsx`
  );
  for (let i = 1; i < getStationData.length; i++) {
    if (station_name === getStationData[i][5]) {
      const toiletObj = {
        railOprIsttCd: getStationData[i][0],
        lnCd: getStationData[i][2],
        stinCd: getStationData[i][4],
        lineName: getStationData[i][3],
      };
      toiletArr.push(toiletObj);
    }
  }
  const toiletData = [];
  for (let i = 0; i < toiletArr.length; i++) {
    const toiletResult = await axios.get(
      `${process.env.NEXT_PUBLIC_OPEN_TOILET}/stationToilet?serviceKey=${toiletKey}&format=json&railOprIsttCd=${toiletArr[i].railOprIsttCd}&lnCd=${toiletArr[i].lnCd}&stinCd=${toiletArr[i].stinCd}`
    );

    const lineNum = toiletResult.data.body
      ? toiletResult.data.body[0].lnCd
      : "호선 정보가 없습니다.";
    const lineName = String(toiletArr[i].lineName);
    const location = toiletResult.data.body
      ? toiletResult.data.body[0].dtlLoc
      : "위치 정보가 없습니다.";
    let inAndOut = toiletResult.data.body
      ? toiletResult.data.body[0].gateInotDvNm
      : "게이트 정보가 없습니다.";
    if (inAndOut === "내") {
      inAndOut = "게이트 안 쪽";
    } else {
      inAndOut = "게이트 바깥 쪽";
    }

    toiletData.push({
      lineNum: lineNum,
      lineName: lineName,
      location: location,
      inAndOut: inAndOut,
    });
  }

  res.status(200).json({
    message: "성공했습니다.",
    lineNumArr: lineNumArr,
    lineData: lineData,
    toiletData: toiletData,
  });
}
