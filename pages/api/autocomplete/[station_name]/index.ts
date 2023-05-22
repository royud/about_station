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

    for (let i = 0; i < getStationData.length; i++) {
      const stationNameCell: any = getStationData[i][3];

      if (stationNameCell.includes(station_name)) {
        autoCompleteArr.push(stationNameCell.split("(")[0]);
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
