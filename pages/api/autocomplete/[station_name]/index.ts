import getXlsxData from "@/xlsx/getXlsxData";
import type { NextApiRequest, NextApiResponse } from "next";
import readXlsxFile from "read-excel-file/node";

type Data = {
  message: string;
  autoComplete: (string | number | boolean | DateConstructor)[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { station_name } = req.query;

    const autoCompleteArr: any[] = [];

    // const getStationData = await getXlsxData();

    const getNineStationData = await readXlsxFile(
      `./xlsx/전국 도시광역철도 역사 화장실 현황_20220630.xlsx`
    );

    const getStationData = [
      ...getNineStationData.slice(1, getNineStationData.length),
    ];

    for (let i = 0; i < getStationData.length; i++) {
      const stationNameCell: any = getStationData[i][2];

      if (stationNameCell.includes(station_name)) {
        autoCompleteArr.push(stationNameCell);
      }
    }

    // sort를 이용하여 작성된 검색어 기준으로 정렬
    // filter로 중복 제거
    // slice로 5개까지
    const filteredAutoCompleteArr = autoCompleteArr
      .sort((a, b) => {
        if (a.indexOf(station_name) > b.indexOf(station_name)) {
          return 1;
        } else if (a.indexOf(station_name) < b.indexOf(station_name)) {
          return -1;
        } else {
          return 0;
        }
      })
      .filter((list, index) => autoCompleteArr.indexOf(list) === index)
      .slice(0, 5);
    res.status(200).json({
      message: "성공했습니다.",
      autoComplete: filteredAutoCompleteArr,
    });
  } catch (err) {
    res.status(500).json({
      message: `error : ${err}`,
      autoComplete: [],
    });
  }
}
