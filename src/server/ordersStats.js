import { executeQuery } from './sql/executeQuery.js'
import xl from 'excel4node'
import addWS from '../utils/addWS.js'
import createCrossTab from '../utils/createCrossTab.js'
import groupBy from '../utils/groupBy.js'

const calculateOrdersStat = async () => {
    const wb1 = new xl.Workbook();

    const query = `SELECT carton, leaveDate, customer, printCode, soldTo,
                    shipTo, wave, division, packedUnit as units, sku, left(wave, 8) as wdate,
                    left(customer, 9) as scust, cartonType
                    FROM japan2.orders`;

    const data = await executeQuery('getSpecificData', undefined, query);

    // let dyTypeUnits = groupBy(data, ['wdate', 'cartonType'], ['units'], [])
    // let xtabIn = { "rowKey": "wdate", "colKey": "cartonType", "sum": "units_sum" }
    // const xtab = createCrossTab(dyTypeUnits, xtabIn);
    // addWS(wb1, 'daysxtab', xtab.colsArr, xtab.res);

    // const inspectionDyVasUnits = groupBy(data, ['wdate', 'inspection'], ['units'], []);
    // xtabIn = { "rowKey": "wdate", "colKey": "inspection", "sum": "units_sum" };
    // console.log(inspectionDyVasUnits[0]);
    // //4 diff spreadsheets, same columns (do not need to repeat column array)

    // // 'shoeTag', 'shoeBoxTag', 'cartonTag'
    // const xtab2 = createCrossTab(inspectionDyVasUnits, xtabIn);
    // addWS(wb1, 'daysvasxtab', xtab2.colsArr, xtab2.res);

    let config = {
        bys: ['wdate'],
        sums: ['units'],
        dcnts: ['soldTo', 'shipTo', 'carton', 'sku']
    }

    let dyAll = groupBy(data, config);
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

    const query1 = `SELECT cartonType, DATEDIFF(STR_TO_DATE(leaveDate, '%Y%m%d'), STR_TO_DATE(generatedDate, '%Y%m%d')) as leadTime, COUNT(distinct carton) as count
                    FROM orders
                    GROUP BY cartonType, leadTime`;

    const data1 = await executeQuery('getSpecificData', undefined, query1);

    console.log(data1[0]);

    data1.map((item) => {
        if (item.leadTime === null) {
            item.leadTime = 'null';
        }
        else {
            item.leadTime = item.leadTime.toString();
        }
    });


    const columns1 = [
        { key: "cartonType", name: "cartonType", idx: 1, type: "string" },
        { key: "leadTime", name: "leadTime", idx: 2, type: "string" },
        { key: "count", name: "count", idx: 3, type: "number" },
    ];

    addWS(wb1, 'leadTimeAll', columns1, data1);

    const query2 = `SELECT STR_TO_DATE(leaveDate, '%Y%m%d') as leaveDate, STR_TO_DATE(generatedDate, '%Y%m%d') as generatedDate, COUNT(distinct carton) as count
                    FROM orders
                    WHERE cartonType = 'key'
                    GROUP BY leaveDate, generatedDate`;

    const data2 = await executeQuery('getSpecificData', undefined, query2);

    data2.map((item) => {
        if (item.generatedDate === null) {
            item.generatedDate = '0000-00-00T00:00:00.000Z';
        }
    })
    const columns2 = [
        { key: "leaveDate", name: "leaveDate", idx: 1, type: "objToString" },
        { key: "generatedDate", name: "generatedDate", idx: 2, type: "objToString" },
        { key: "count", name: "count", idx: 3, type: "number" },
    ];

    addWS(wb1, 'leadTimeKey', columns2, data2);

    console.log(data2[0]);

    const query3 = `SELECT LEFT(wave, 8) AS wave, vasTime > 0 AS hasVas, cartontype, COUNT(*) as count
                    FROM cartons
                    GROUP BY wave, hasVas, cartontype`;

    const data3 = await executeQuery('getSpecificData', undefined, query3);

    const columns3 = [
        { key: "wave", name: "wave", idx: 1, type: "string" },
        { key: "hasVas", name: "hasVas", idx: 2, type: "number" },
        { key: "count", name: "count", idx: 3, type: "number" },
    ];

    addWS(wb1, 'pickingFlows', columns3, data3);

    console.log(data3[0]);



    let actOrds = data.filter(ln => ln.cartonType == 'active')
    config = {
        bys: ['wdate'],
        sums: ['units'],
        dcnts: ['soldTo', 'shipTo', 'carton', 'sku']
    }
    let dyActAll = groupBy(actOrds, config)
    addWS(wb1, 'daysActSum', columns, dyActAll);

    let fcOrds = data.filter(ln => ln.cartonType == 'FC')
    let dyFcAll = groupBy(fcOrds, config)
    addWS(wb1, 'daysFCSum', columns, dyFcAll);

    let popOrds = data.filter(ln => ln.cartonType == 'POP')
    let dyPopAll = groupBy(popOrds, config)
    addWS(wb1, 'daysPOPSum', columns, dyPopAll);

    let keyOrds = data.filter(ln => ln.cartonType == 'key')
    let dyKeyAll = groupBy(keyOrds, config)
    addWS(wb1, 'daysKEYSum', columns, dyKeyAll);

    const config1 = {
        bys: ['scust', 'inspection', 'shoeTag', 'shoeBoxTag', 'cartonTag'],
        sums: ['units'],
        dcnts: ['carton', 'wdate', 'shipTo', 'sku']
    }

    let custAll = groupBy(data, config1)
    let columns4 = [
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
    addWS(wb1, 'custsum', columns4, custAll);

    let custKeyAll = groupBy(keyOrds, config1)
    addWS(wb1, 'custKeysum', columns4, custKeyAll);

    //  SINGLE DAY = 20200324
    let Ords20200324 = actOrds.filter(ln => ln.wdate == '20200324')
    config = {
        bys: ['sku'],
        sums: ['units'],
        dcnts: ['carton', 'shipTo']
    }
    let sku20200324 = groupBy(Ords20200324, ['sku'], ['units'], ['carton', 'shipTo'])
    let columns5 = [
        { key: "sku", name: "SKU", idx: 1, type: "string" },
        { key: "cnt", name: "lines", idx: 2, type: "number" },
        { key: "units_sum", name: "units", idx: 3, type: "number" },
        { key: "carton_dcnt", name: "cartons", idx: 4, type: "number" },
        { key: "shipTo_dcnt", name: "ShipTos", idx: 5, type: "number" },
    ]
    addWS(wb1, 'sku20200324', columns5, sku20200324);

    let cust20200324 = groupBy(Ords20200324, config1)
    addWS(wb1, 'cust20200324', columns4, cust20200324);

    wb1.write('ExcelFile3.xlsx')
    console.log("writen sheet")
}

calculateOrdersStat();