import executeQuery from './sql/executeQuery.js'
import groupBy from '../utils/groupBy.js'
import xl from 'excel4node'
import addWS from '../utils/addWS.js'


const buildReturnsStatistics = async () => {
    const table = 'asn';
    const query = `SELECT *
                    from japan2.${table}
                    where recRtn = 'Return'`;

    const data = await executeQuery('getSpecificData', table, query);
    console.log(data[0]);
    const bys = ['verifiedDate'];
    const sums = ['unitsVerified'];
    const dcnts = ['sku'];

    const grouppedData = groupBy(data, bys, sums, dcnts);
    return grouppedData;
}

const main = async () => {
    const statistics = await buildReturnsStatistics();
    console.log(statistics);
    const workBook = new xl.Workbook();
    const columns = [
        { key: "verifiedDate", name: "Date", idx: 1, type: "objToString" },
        { key: "unitsVerified_sum", name: "unitsSum", idx: 2, type: "number" },
        { key: "sku_dcnt", name: "dSkus", idx: 3, type: "number" },
    ]
    addWS(workBook, 'returns', columns, statistics);
    workBook.write(`asn_daily_returns.xlsx`);
}

main();
