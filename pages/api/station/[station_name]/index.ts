import getXlsxData from "@/xlsx/getXlsxData";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
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
  const { station_name } = req.query;

  const getStationData: any[] = await getXlsxData();

  const getStationNameArr: any[] = [];
  for (let i = 0; i < getStationData.length; i++) {
    getStationNameArr.push(getStationData[i][2]);
  }

  const toiletData: any[] = [];
  if (!getStationNameArr.includes(station_name)) {
    res.status(404).json({
      message: `현재 데이터에 등록되지 않은 역 이름입니다. '${station_name}'`,
      toiletData: [],
    });
  }
  for (let i = 0; i < getStationData.length; i++) {
    if (getStationData[i][2] === station_name) {
      const lineName: string = String(getStationData[i][1]);
      const toiletId: number = Number(getStationData[i][3]);
      const location: string = String(getStationData[i][8]);
      const inAndOut: string = String(getStationData[i][6]);

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
  res.status(200).json({
    message: `'${station_name}'역 검색에 성공했습니다.`,
    toiletData: toiletData,
  });
}
