import { executeQuery } from './sql/executeQuery.js'
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
        let abBandsPalletsSum = 0;
        let cdBandCasesSum = 0;
        volBands.map((el) => {
            if (el.volBand === 'A' || el.volBand === 'B') {
                abBandsPalletsSum += el.pallets_sum;
            }
            if (el.volBand === 'D' || el.volBand === 'C') {
                cdBandCasesSum += el.cases_sum;
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
            abBandsPalletsSum,
            cdBandCasesSum
        }
    })
    return result;
}

const getVolBandStatistics = async () => {
    const query = `SELECT volBand, COUNT(*), SUM(units), SUM(cases), SUM(pallets), 
                SUM(pallequiv), count(distinct sku), count(distinct shipment) 
                FROM japan2.sasn GROUP BY volband`;

    const data = await executeQuery('getSpecificData', undefined, query);
    console.log(data[0]);
    return data;
}

const main = async () => {
    const statistics = await buildSasnStatistics();
    console.log(statistics)
    const volBandStat = await getVolBandStatistics();
    const workBook = new xl.Workbook();
    const columns1 = [
        { key: "date", name: "Date", idx: 1, type: "objToString" },
        { key: "containers", name: "containers", idx: 2, type: "number" },
        { key: "palletsSum", name: "palletsSum", idx: 3, type: "number" },
        { key: "pallEquivSum", name: "pallEquivSum", idx: 4, type: "number" },
        { key: "casesSum", name: "casesSum", idx: 5, type: "number" },
        { key: "unitsSum", name: "unitsSum", idx: 6, type: "number" },
        { key: "dSkus", name: "dSkus", idx: 7, type: "number" },
        { key: "dStyles", name: "dStyles", idx: 8, type: "number" },
        { key: "abBandsPalletsSum", name: "abBandsPalletsSum", idx: 9, type: "number" },
        { key: "cdBandCasesSum", name: "cdBandCasesSum", idx: 10, type: "number" },
    ]
    addWS(workBook, type, columns1, statistics);
    workBook.write(`asn_${type}.xlsx`);

    const columns2 = [
        { key: "volBand", name: "volBand", idx: 1, type: "string" },
        { key: "COUNT(*)", name: "count", idx: 2, type: "number" },
        { key: "SUM(units)", name: "unitsSum", idx: 3, type: "number" },
        { key: "SUM(cases)", name: "casesSum", idx: 4, type: "number" },
        { key: "SUM(pallets)", name: "palletsSum", idx: 5, type: "number" },
        { key: "SUM(pallequiv)", name: "pallEquivSum", idx: 6, type: "number" },
        { key: "count(distinct sku)", name: "skus", idx: 7, type: "number" },
        { key: "count(distinct shipment)", name: "shipments", idx: 8, type: "number" },
    ];

    addWS(workBook, 'volBands', columns2, volBandStat);
    workBook.write(`asn_${type}.xlsx`);
}

main();