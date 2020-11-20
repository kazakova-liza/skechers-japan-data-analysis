import executeQuery from './sql/executeQuery.js'
import xl from 'excel4node'
import addWS from '../utils/addWS.js'
import createCrossTab from '../utils/createCrossTab.js'
import groupBy from '../utils/groupBy.js'

// import groupBy from '../utils/groupBy.js'


const test1 = async () => {
    const wb1 = new xl.Workbook();

    const data = await executeQuery('getAllData', 'cartons');

    data.forEach((act) => {
        act.wdate = act.wave.slice(0,9)
        act.scust = act.customer.slice(0,9)
    })

    let dyTypeUnits = groupBy(data, ['wdate', 'cartonType'], ['units'], [])
    let xtabIn = { "rowKey": "wdate", "colKey": "cartonType", "sum": "units_sum" }
    const xtab = createCrossTab(dyTypeUnits, xtabIn);
    addWS(wb1, 'daysxtab', xtab.colsArr, xtab.res);

    let dyAll = groupBy(data, ['wdate'], ['lines2','units'], ['soldTo','shipTo'])
    const columns = [
        { key: "wdate", name: "Date", idx: 1, type: "string" },
        { key: "cnt", name: "cartons", idx: 2, type: "number" },
        { key: "lines2_sum", name: "lines", idx: 3, type: "number" },
        { key: "units_sum", name: "units", idx: 4, type: "number" },
        { key: "soldTo_dcnt", name: "SoldTos", idx: 5, type: "number" },
        { key: "shipTo_dcnt", name: "ShipTos", idx: 6, type: "number" },
    ]
    addWS(wb1, 'dayssum', columns, dyAll);

    let custAll = groupBy(data, ['scust'], ['lines2','units'], ['wdate','shipTo'])
    let columns1 = [
        { key: "scust", name: "Cust", idx: 1, type: "string" },
        { key: "cnt", name: "cartons", idx: 2, type: "number" },
        { key: "lines2_sum", name: "lines", idx: 3, type: "number" },
        { key: "units_sum", name: "units", idx: 4, type: "number" },
        { key: "wdate_dcnt", name: "dates", idx: 5, type: "number" },
        { key: "shipTo_dcnt", name: "ShipTos", idx: 6, type: "number" },
    ]
    addWS(wb1, 'custsum', columns1, custAll);

    
    wb1.write('ExcelFile3.xlsx')
    console.log("writen sheet")
}

test1();