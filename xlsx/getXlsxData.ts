import readXlsxFile from "read-excel-file/node";

export default async function getXlsxData() {
  const getNineStationData = await readXlsxFile(
    `./xlsx/전국 도시광역철도 역사 화장실 현황_20220630.xlsx`
  );
  const getStationData = [
    ...getNineStationData.slice(1, getNineStationData.length),
  ];
  return getStationData;
}
