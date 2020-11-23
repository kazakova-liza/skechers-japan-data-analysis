import executeQuery from './sql/executeQuery.js'
import groupBy from '../utils/groupBy.js'
import xl from 'excel4node'
import addWS from '../utils/addWS.js'

const table = 'sasn';
const type = 'greaterThan100Cases';
//const type = 'lessThan100Cases';

const buildSasnStatistics = async () => {
    let condition;

    if (type === 'greaterThan100Cases') {
        condition = 'sum >= 100';
    }
    else {
        condition = 'sum < 100';
    }
    const query = `WITH temp as (SELECT verifiedDate, shipment, sum(cases) as sum
				                FROM japan2.${table}
				                group by verifiedDate, shipment
				                having ${condition})  
                SELECT *
                FROM japan2.${table} ${table}
                inner join temp
                on temp.verifiedDate = ${table}.verifiedDate
                and temp.shipment = ${table}.shipment
                order by ${table}.shipment`;

    const data = await executeQuery('getSpecificData', table, query);
    console.log(data[0]);
    let bys = ['verifiedDate'];
    let sums = ['pallets', 'pallEquiv', 'cases', 'units'];
    let dcnts = ['shipment', 'sku', 'style'];

    const grouppedByDate = groupBy(data, bys, sums, dcnts);

    bys = ['verifiedDate', 'volBand'];
    sums = ['pallets', 'cases'];
    dcnts = [];

    const grouppedByDateVolBand = groupBy(data, bys, sums, dcnts);

    const result = grouppedByDate.map((item) => {
        const volBands = grouppedByDateVolBand.filter((el) => el.verifiedDate === item.verifiedDate);
        let acBandsPalletsSum = 0;
        let dBandCasesSum = 0;
        volBands.map((el) => {
            if (el.volBand === 'A' || el.volBand === 'B' || el.volBand === 'C') {
                acBandsPalletsSum += el.pallets_sum;
            }
            if (el.volBand === 'D') {
                dBandCasesSum += el.cases_sum;
            }
        })
        return {
            date: item.verifiedDate,
            containers: item.shipment_dcnt,
            palletsSum: item.pallets_sum,
            pallEquivSum: item.pallEquiv_sum,
            casesSum: item.cases_sum,
            unitsSum: item.units_sum,
            dSkus: item.sku_dcnt,
            dStyles: item.style_dcnt,
            acBandsPalletsSum,
            dBandCasesSum
        }
    })
    return result;
}

const main = async () => {
    const statistics = await buildSasnStatistics();
    console.log(statistics)
    const workBook = new xl.Workbook();
    const columns = [
        { key: "date", name: "Date", idx: 1, type: "objToString" },
        { key: "containers", name: "containers", idx: 2, type: "number" },
        { key: "palletsSum", name: "palletsSum", idx: 3, type: "number" },
        { key: "pallEquivSum", name: "pallEquivSum", idx: 4, type: "number" },
        { key: "casesSum", name: "casesSum", idx: 5, type: "number" },
        { key: "unitsSum", name: "unitsSum", idx: 6, type: "number" },
        { key: "dSkus", name: "dSkus", idx: 7, type: "number" },
        { key: "dStyles", name: "dStyles", idx: 8, type: "number" },
        { key: "acBandsPalletsSum", name: "acBandsPalletsSum", idx: 9, type: "number" },
        { key: "dBandCasesSum", name: "dBandCasesSum", idx: 10, type: "number" },
    ]
    addWS(workBook, type, columns, statistics);
    workBook.write(`asn_${type}.xlsx`);
}

main();