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
    lineName: string;
    lineArr: {
      toiletId: number;
      location: string;
      inAndOut: string;
    }[];
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
  const getSeoulStationData = await readXlsxFile(
    `${__dirname}/../../../../../xlsx/서울교통공사_화장실_20220530.xlsx`
  );
  const getRedStationData = await readXlsxFile(
    `${__dirname}/../../../../../xlsx/신분당선_화장실_20220630.xlsx`
  );
  const getNineStationData = await readXlsxFile(
    `${__dirname}/../../../../../xlsx/서울메트로9호선_화장실_20220630.xlsx`
  );
  const getStationData = [
    ...getSeoulStationData.slice(4, getSeoulStationData.length),
    ...getRedStationData.slice(4, getRedStationData.length),
    ...getNineStationData.slice(4, getNineStationData.length),
  ];

  const toiletData: any[] = [];
  for (let i = 0; i < getStationData.length; i++) {
    if (getStationData[i][3] === station_name) {
      const lineName: string = String(getStationData[i][2]);
      const toiletId: number = Number(getStationData[i][0]);
      const location: string = String(getStationData[i][9]);
      const inAndOut: string = String(getStationData[i][7]);

      const lineArr: any[] = [];

      const toiletList = {
        toiletId: toiletId,
        location: location,
        inAndOut: inAndOut,
      };

      if (toiletData.length === 0) {
        const lineList = {
          lineName: lineName,
          lineArr: lineArr,
        };
        lineArr.push(toiletList);
        toiletData.push(lineList);
      } else if (toiletData[toiletData.length - 1].lineName === lineName) {
        toiletData[toiletData.length - 1].lineArr.push(toiletList);
      } else {
        const lineList = {
          lineName: lineName,
          lineArr: lineArr,
        };
        lineArr.push(toiletList);
        toiletData.push(lineList);
      }
    }
  }

  // --------------------------------------------------------------------------

  res.status(200).json({
    message: "성공했습니다.",
    lineNumArr: lineNumArr,
    lineData: lineData,
    toiletData: toiletData,
  });
}
