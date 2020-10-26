import executeQuery from './sql/executeQuery.js'
import { updateField } from './sql/executeQuery.js'
import groupBy from '../utils/groupBy.js'
import xl from 'excel4node'

const addWS = (wbook, nme, columns, data) => {
    const ws = wbook.addWorksheet(nme);
    //Write Column Title in Excel file
    columns.forEach(col => {
        ws.cell(1, col.idx)
            .string(col.name)
    });
    let rowIndex = 2;
    data.forEach( record => {
        columns.forEach(col =>{
            if(col.type == "string") ws.cell(rowIndex, col.idx).string(record[col.key])
            if(col.type == "number") ws.cell(rowIndex, col.idx).number(record[col.key])
            if(col.type == "objToString") ws.cell(rowIndex, col.idx).string(record[col.key].toString())
            if(col.type == "date") ws.cell(rowIndex, col.idx).date(record[col.key]).style({numberFormat: 'yyyy-mm-dd'})
        });
        rowIndex++;
    }); 
}


const main = async () => {
    const wb1 = new xl.Workbook();

    // const allOrds = await executeQuery('getSQL', 'call joinerDetail()');

    // var ctns = {}
    // allOrds[0].forEach((act) => {
    //     if (!(act.CARTON in ctns )){
    //         ctns[act.CARTON] = []
    //     }
    //     ctns[act.CARTON].push(act.STYLE + act.COLOR + act.SIZE + '-' + act.QTYPACK.toString())
    // })
    // for (const val of Object.values(ctns)) {
    //     val.sort()
    // }
    // var ctnArr = []
    // for (const val of Object.values(ctns)) {
    //     if (val.length > 1){
    //         ctnArr.push({'mx':val.toString()})
    //     }
    // }
    // const ctnArrSum = groupBy(ctnArr, ['mx'], [], [])
    // var ctnArrSumBig = ctnArrSum.filter((a) => a.cnt > 71)
    // ctnArrSumBig.sort((a, b) => a.cnt - b.cnt)

    // const columns1 = [
    //     {"key": "mx","name": "mix", "idx":1, "type":"string"},
    //     {"key": "cnt","name": "cartons", "idx":2, "type":"number"},
    // ]
    // addWS(wb1, 'key cartons', columns1, ctnArrSumBig); 

//chiyodaKey3oct
    await chiyodaKey3oct()

   



//ACTIVE & KEY ANALYSIS
    // const activelines = await executeQuery('getSQL', 'call joinerActive()');
    // const keylines = await executeQuery('getSQL', 'call joinerKey()');

    // const activeByDate = groupBy(activelines[0], ['dte'], ['qty'], ['carton', 'sku', 'CUST', 'SHIP_TO'])
    // const keyByDate = groupBy(keylines[0], ['dte'], ['qty'], ['carton', 'sku', 'CUST', 'SHIP_TO'])

    // const columns2 = [
    //     {"key": "dte","name": "Date", "idx":1, "type":"date"},
    //     {"key": "carton_dcnt","name": "Cartons", "idx":2, "type":"number"},
    //     {"key": "cnt","name": "Lines", "idx":3, "type":"number"},
    //     {"key": "qty_sum","name": "Pairs", "idx":4, "type":"number"},
    //     {"key": "sku_dcnt","name": "SKUs", "idx":5, "type":"number"},
    //     {"key": "CUST_dcnt","name": "Customers", "idx":6, "type":"number"},
    //     {"key": "SHIP_TO_dcnt","name": "Ship tos", "idx":7, "type":"number"}
    // ]

    // addWS(wb1, 'Active by Date', columns2, activeByDate);
    // addWS(wb1, 'Key by Date', columns2, keyByDate);

    // keylines[0].forEach((act) => { 
    //     act.style = act.sku.slice(0,8)
    //     act.col = act.sku.slice(8,11)
    //     if (act.CUST.slice(0,8)  == 'SKECHERS') act.CUST = 'SKECHERS'
    // })

    // activelines[0].forEach((act) => { 
    //     act.style = act.sku.slice(0,8)
    //     act.col = act.sku.slice(8,11)
    //     if (act.CUST.slice(0,8)  == 'SKECHERS') act.CUST = 'SKECHERS'
    // })
    // const activeByCarton = groupBy(activelines[0], ['CUST', 'carton','SHIP_TO', 'dte'], ['qty'], ['style', 'sku', 'PO'])
    // const activeByCust = groupBy(activeByCarton, ['CUST'], ['cnt', 'qty_sum', 'qty_max', 'sku_dcnt', 'style_dcnt', 'PO_dcnt'], ['SHIP_TO', 'dte'])
   
    // const keyByCarton = groupBy(keylines[0], ['CUST', 'carton','SHIP_TO', 'dte'], ['qty'], ['style', 'sku', 'PO'])
    // const keyByCust = groupBy(keyByCarton, ['CUST'], ['cnt', 'qty_sum', 'qty_max', 'sku_dcnt', 'style_dcnt', 'PO_dcnt'], ['SHIP_TO', 'dte'])

    // const columns3 = [
    //     {"key": "CUST","name": "Customer", "idx":1, "type":"string"},
    //     {"key": "cnt","name": "Cartons", "idx":2, "type":"number"},
    //     {"key": "cnt_sum","name": "Lines", "idx":3, "type":"number"},
    //     {"key": "cnt_max","name": "Max lines per carton", "idx":4, "type":"number"},
    //     {"key": "PO_dcnt_max","name": "Max POs per carton", "idx":5, "type":"number"},
    //     {"key": "qty_max_max","name": "Max pairs per carton", "idx":6, "type":"number"},
    //     {"key": "qty_sum_sum","name": "Pairs", "idx":7, "type":"number"},
    //     {"key": "sku_dcnt_max","name": "Max SKUs per carton", "idx":8, "type":"number"},
    //     {"key": "style_dcnt_max","name": "Max Styles per carton", "idx":9, "type":"number"},
    //     {"key": "SHIP_TO_dcnt","name": "Ship tos", "idx":10, "type":"number"},
    //     {"key": "dte_dcnt","name": "Dates", "idx":11, "type":"number"},
    // ]

    // addWS(wb1, 'Active  by customer', columns3, activeByCust);
    // addWS(wb1, 'Key  by customer', columns3, keyByCust);
    
    
    wb1.write('ExcelFile2.xlsx')

    //await updateField('EX20ASN', 'productGroup', 'avgCaseLength', avg);
}

const chiyodaKey3oct = async() => {
    const chiyodaKey3oct = await executeQuery('getSQL', 'call chiyodaKey3oct()');
    
    const chiyodaBySKU = groupBy(chiyodaKey3oct[0], ['sku'], ['qty'], ['carton', 'SHIP_TO'])
    const chiyodaByCarton = groupBy(chiyodaKey3oct[0], ['carton'], ['qty'], ['sku'])
    const chiyodaByShipTo = groupBy(chiyodaKey3oct[0], ['SHIP_TO'], ['qty'], ['sku', 'carton'])

    var ctns = {}
    chiyodaKey3oct[0].forEach((act) => {
        if (!(act.carton in ctns )){
            ctns[act.carton] = []
        }
        ctns[act.carton].push(act.sku + '-' + act.qty.toString())
    })
    for (const val of Object.values(ctns)) {
        val.sort()
    }
    var ctnArr = []
    for (const val of Object.values(ctns)) {
        ctnArr.push({'mx':val.toString()})
    }
    const ctnArrSum = groupBy(ctnArr, ['mx'], [], [])
    const columns1 = [
        {"key": "mx","name": "mix", "idx":1, "type":"string"},
        {"key": "cnt","name": "cartons", "idx":2, "type":"number"},
    ]
    addWS(wb1, 'key cartons', columns1, ctnArrSum);
}


main();



