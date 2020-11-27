import executeQuery from './sql/executeQuery.js'
import xl from 'excel4node'
import addWS from '../utils/addWS.js'
import createCrossTab from '../utils/createCrossTab.js'
import groupBy from '../utils/groupBy.js'

// import groupBy from '../utils/groupBy.js'


const test1 = async () => {
    const wb1 = new xl.Workbook();

    const query = `SELECT carton, leaveDate, customer, printCode, soldTo,
                    shipTo, wave, division, packedUnit as units, sku, left(wave, 8) as wdate,
                    inspection, shoeTag, shoeBoxTag, cartonTag, left(customer, 9) as scust, cartonType
                    FROM japan2.orders`;

    const data = await executeQuery('getSpecificData', undefined, query);

    let dyTypeUnits = groupBy(data, ['wdate', 'cartonType'], ['units'], [])
    let xtabIn = { "rowKey": "wdate", "colKey": "cartonType", "sum": "units_sum" }
    const xtab = createCrossTab(dyTypeUnits, xtabIn);
    addWS(wb1, 'daysxtab', xtab.colsArr, xtab.res);

    let dyVasUnits = groupBy(data, ['wdate', 'inspection', 'shoeTag', 'shoeBoxTag', 'cartonTag'], ['units'], [])
    xtabIn = { "rowKey": "wdate", "colKey": "vas", "sum": "units_sum" }
    //4 diff spreadsheets, same columns (do not need to repeat column array)
    const xtab2 = createCrossTab(dyVasUnits, xtabIn);
    addWS(wb1, 'daysvasxtab', xtab2.colsArr, xtab2.res);

    let dyAll = groupBy(data, ['wdate'], ['units'], ['soldTo', 'shipTo', 'carton', 'sku'])
    const columns = [
        { key: "wdate", name: "Date", idx: 1, type: "string" },
        { key: "cnt", name: "lines", idx: 2, type: "number" },
        { key: "units_sum", name: "units", idx: 3, type: "number" },
        { key: "soldTo_dcnt", name: "SoldTos", idx: 4, type: "number" },
        { key: "shipTo_dcnt", name: "ShipTos", idx: 5, type: "number" },
        { key: "carton_dcnt", name: "Cartons", idx: 6, type: "number" },
        { key: "sku_dcnt", name: "SKUs", idx: 7, type: "number" },
    ]
    addWS(wb1, 'dayssum', columns, dyAll);

    let actOrds = data.filter(ln => ln.cartonType == 'active')
    let dyActAll = groupBy(actOrds, ['wdate'], ['units'], ['soldTo', 'shipTo', 'carton', 'sku'])
    addWS(wb1, 'daysActSum', columns, dyActAll);

    let fcOrds = data.filter(ln => ln.cartonType == 'FC')
    let dyFcAll = groupBy(fcOrds, ['wdate'], ['units'], ['soldTo', 'shipTo', 'carton', 'sku'])
    addWS(wb1, 'daysFCSum', columns, dyFcAll);

    let popOrds = data.filter(ln => ln.cartonType == 'POP')
    let dyPopAll = groupBy(popOrds, ['wdate'], ['units'], ['soldTo', 'shipTo', 'carton', 'sku'])
    addWS(wb1, 'daysPOPSum', columns, dyPopAll);

    let keyOrds = data.filter(ln => ln.cartonType == 'key')
    let dyKeyAll = groupBy(keyOrds, ['wdate'], ['units'], ['soldTo', 'shipTo', 'carton', 'sku'])
    addWS(wb1, 'daysKEYSum', columns, dyKeyAll);

    let custAll = groupBy(data, ['scust', 'inspection', 'shoeTag', 'shoeBoxTag', 'cartonTag'], ['units'], ['carton', 'wdate', 'shipTo', 'sku'])
    let columns1 = [
        { key: "scust", name: "Cust", idx: 1, type: "string" },
        { key: "cnt", name: "lines", idx: 2, type: "number" },
        { key: "units_sum", name: "units", idx: 3, type: "number" },
        { key: "carton_dcnt", name: "cartons", idx: 4, type: "number" },
        { key: "wdate_dcnt", name: "dates", idx: 5, type: "number" },
        { key: "shipTo_dcnt", name: "ShipTos", idx: 6, type: "number" },
        { key: "sku_dcnt", name: "SKUs", idx: 7, type: "number" },
        { key: "inspection", name: "inspection", idx: 8, type: "string" },
        { key: "shoeTag", name: "shoeTag", idx: 9, type: "string" },
        { key: "shoeBoxTag", name: "shoeBoxTag", idx: 10, type: "string" },
        { key: "cartonTag", name: "cartonTag", idx: 11, type: "string" },
    ]
    addWS(wb1, 'custsum', columns1, custAll);

    let custKeyAll = groupBy(keyOrds, ['scust', 'inspection', 'shoeTag', 'shoeBoxTag', 'cartonTag'], ['units'], ['carton', 'wdate', 'shipTo', 'sku'])
    addWS(wb1, 'custKeysum', columns1, custKeyAll);

    //  SINGLE DAY = 20200324
    let Ords20200324 = actOrds.filter(ln => ln.wdate == '20200324')
    let sku20200324 = groupBy(Ords20200324, ['sku'], ['units'], ['carton', 'shipTo'])
    let columns2 = [
        { key: "sku", name: "SKU", idx: 1, type: "string" },
        { key: "cnt", name: "lines", idx: 2, type: "number" },
        { key: "units_sum", name: "units", idx: 3, type: "number" },
        { key: "carton_dcnt", name: "cartons", idx: 4, type: "number" },
        { key: "shipTo_dcnt", name: "ShipTos", idx: 5, type: "number" },
    ]
    addWS(wb1, 'sku20200324', columns2, sku20200324);

    let cust20200324 = groupBy(Ords20200324, ['scust', 'inspection', 'shoeTag', 'shoeBoxTag', 'cartonTag'], ['units'], ['carton', 'wdate', 'shipTo', 'sku'])
    addWS(wb1, 'cust20200324', columns1, cust20200324);

    wb1.write('ExcelFile3.xlsx')
    console.log("writen sheet")
}

test1();