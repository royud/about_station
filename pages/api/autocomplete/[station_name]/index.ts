import type { NextApiRequest, NextApiResponse } from "next";

import { MongoClient } from "mongodb";

const mongoUrl: any = process.env.NEXT_PUBLIC_MONGODB_URL;

const client = new MongoClient(mongoUrl);

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

    const database = client.db("app_station");
    const toilets = database.collection("toilets");

    const list = await toilets.find().toArray();

    for (let i = 0; i < list.length; i++) {
      if (list[i].stationName.includes(station_name)) {
        autoCompleteArr.push(list[i].stationName);
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
