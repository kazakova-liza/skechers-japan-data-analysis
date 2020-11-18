import executeQuery from './sql/executeQuery.js'
import xl from 'excel4node'
import addWS from '../utils/addWS.js'
import createCrossTab from '../utils/createCrossTab.js'
// import groupBy from '../utils/groupBy.js'


const test1 = async () => {
    const wb1 = new xl.Workbook();

    // let query = `SELECT left(wave,8) as wdate, cartonType, count(*) as cartons 
    //                 FROM japan2.cartons
    //                 GROUP BY 1,2`;
    // let xtabIn = {"rowKey":"wdate", "colKey":"cartonType", "sum":"cartons"}

    let query = `SELECT left(wave,8) as wdate, cartonType, sum(units) as units 
                    FROM japan2.cartons
                    GROUP BY 1,2`;
    let xtabIn = { "rowKey": "wdate", "colKey": "cartonType", "sum": "units" }
    let data = await executeQuery('getSpecificData', undefined, query);
    console.log(data[0]);

    const xtab = createCrossTab(data, xtabIn);
    addWS(wb1, 'days', xtab.colsArr, xtab.res);
    wb1.write('ExcelFile3.xlsx')
}

test1();