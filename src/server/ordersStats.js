import { executeQuery } from './sql/executeQuery.js'
import xl from 'excel4node'
import addWS from '../utils/addWS.js'
import createCrossTab from '../utils/createCrossTab.js'
import groupBy from '../utils/groupBy.js'
import createColumnsArray from './createColumnsArray.js'
import addCalculations from './addCalculations.js'

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

    const config = {
        bys: ['wdate'],
        sums: ['units'],
        dcnts: ['soldTo', 'shipTo', 'carton', 'sku']
    }
    const dyAll = groupBy(data, config);
    const columns = createColumnsArray(dyAll[0]);

    const ws = wb1.addWorksheet('dayssum');
    addWS(ws, columns, dyAll);
    addCalculations(ws, columns, dyAll);


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

    const columns1 = createColumnsArray(data1[0]);
    const ws1 = wb1.addWorksheet('leadTimeAll');
    addWS(ws1, columns1, data1);
    addCalculations(ws1, columns1, data1);

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

    const columns2 = createColumnsArray(data2[0]);
    const ws2 = wb1.addWorksheet('leadTimeKey');
    addWS(ws2, columns2, data2);
    addCalculations(ws2, columns2, data2);

    const query3 = `SELECT LEFT(wave, 8) AS wave, vasTime > 0 AS hasVas, cartontype, COUNT(*) as count
                    FROM cartons
                    GROUP BY wave, hasVas, cartontype`;

    const data3 = await executeQuery('getSpecificData', undefined, query3);

    const columns3 = createColumnsArray(data3[0]);
    const ws3 = wb1.addWorksheet('pickingFlows');
    addWS(ws3, columns3, data3);
    addCalculations(ws3, columns3, data3);

    let actOrds = data.filter(ln => ln.cartonType == 'active')
    const config1 = {
        bys: ['wdate'],
        sums: ['units'],
        dcnts: ['soldTo', 'shipTo', 'carton', 'sku']
    }
    let dyActAll = groupBy(actOrds, config1)
    const columns4 = createColumnsArray(dyActAll[0]);
    const ws4 = wb1.addWorksheet('daysActSum');
    addWS(ws4, columns4, dyActAll);
    addCalculations(ws4, columns4, dyActAll);

    let fcOrds = data.filter(ln => ln.cartonType == 'FC')
    let dyFcAll = groupBy(fcOrds, config1)
    const columns5 = createColumnsArray(dyActAll[0]);
    const ws5 = wb1.addWorksheet('dyFcAll');
    addWS(ws5, columns5, dyFcAll);
    addCalculations(ws5, columns5, dyFcAll);


    let popOrds = data.filter(ln => ln.cartonType == 'POP')
    let dyPopAll = groupBy(popOrds, config1);
    const columns6 = createColumnsArray(dyPopAll[0]);
    const ws6 = wb1.addWorksheet('daysPOPSum');
    addWS(ws6, columns6, dyPopAll);
    addCalculations(ws6, columns6, dyPopAll);

    let keyOrds = data.filter(ln => ln.cartonType == 'key')
    let dyKeyAll = groupBy(keyOrds, config1)
    const columns7 = createColumnsArray(dyKeyAll[0]);
    const ws7 = wb1.addWorksheet('daysKEYSum');
    addWS(ws7, columns7, dyKeyAll);
    addCalculations(ws7, columns7, dyKeyAll);

    const config2 = {
        bys: ['scust', 'inspection', 'shoeTag', 'shoeBoxTag', 'cartonTag'],
        sums: ['units'],
        dcnts: ['carton', 'wdate', 'shipTo', 'sku']
    }

    let custAll = groupBy(data, config2)
    const columns8 = createColumnsArray(custAll[0]);
    const ws8 = wb1.addWorksheet('custsum');
    addWS(ws8, columns8, custAll);
    addCalculations(ws8, columns8, custAll);

    let custKeyAll = groupBy(keyOrds, config2);
    const columns9 = createColumnsArray(custKeyAll[0]);
    const ws9 = wb1.addWorksheet('custKeysum');
    addWS(ws9, columns9, custKeyAll);
    addCalculations(ws9, columns9, custKeyAll);

    //  SINGLE DAY = 20200324
    let Ords20200324 = actOrds.filter(ln => ln.wdate == '20200324')
    const config3 = {
        bys: ['sku'],
        sums: ['units'],
        dcnts: ['carton', 'shipTo']
    }
    let sku20200324 = groupBy(Ords20200324, config3);
    const columns10 = createColumnsArray(sku20200324[0]);
    const ws10 = wb1.addWorksheet('sku20200324');
    addWS(ws10, columns10, sku20200324);
    addCalculations(ws10, columns10, sku20200324);

    let cust20200324 = groupBy(Ords20200324, config3);
    const columns11 = createColumnsArray(cust20200324[0]);
    const ws11 = wb1.addWorksheet('cust20200324');
    addWS(ws11, columns11, cust20200324);
    addCalculations(ws11, columns11, cust20200324);

    wb1.write('ordersStats.xlsx')
    console.log("writen sheet")
}

calculateOrdersStat();