import type { NextApiRequest, NextApiResponse } from "next";

import { MongoClient } from "mongodb";

const mongoUrl: any = process.env.NEXT_PUBLIC_MONGODB_URL;

const client = new MongoClient(mongoUrl);

type Data = {
  message: string;
  toiletData: {
    lineName: string;
    lineArr: {
      toiletId: number;
      location: string;
      inAndOut: string;
      MaleOrFemale: string;
      etc: string;
    }[];
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { station_name } = req.query;

  const database = client.db("app_station");
  const toilets = database.collection("toilets");

  const toilet: any = await toilets.findOne({
    stationName: station_name,
  });

  const toiletData = toilet.toiletArr;

  res.status(200).json({
    message: `'${station_name}'역 검색 결과입니다.`,
    toiletData: toiletData,
  });
}
