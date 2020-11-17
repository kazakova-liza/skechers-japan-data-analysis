import executeQuery from './sql/executeQuery.js'
import groupBy from '../utils/groupBy.js'
import xl from 'excel4node'
import addWS from '../utils/addWS.js'


const findKeyAccounts = (allOrds) => {
    const wb1 = new xl.Workbook();

    // const table = 'orders';
    // const allOrds = await executeQuery('getAllData', table);

    // console.log(allOrds[0]);

    var ctns = {}
    allOrds.forEach((act) => {
        if (act.packedUnit_int > 0) {
            if (!(act.carton in ctns)) {
                ctns[act.carton] = []
            }
            ctns[act.carton].push(act.sku + '-' + act.packedUnit.toString())
            // console.log(ctns);
        }
    })


    for (const val of Object.values(ctns)) {
        val.sort()
    }
    var ctnArr = []

    for (const val of Object.values(ctns)) {
        if (val.length > 1) {
            ctnArr.push({ 'mx': val.toString() })
        }
    }

    // console.log(ctnArr[0]);

    const ctnArrSum = groupBy(ctnArr, ['mx'], [], [])

    var ctnArrSumBig = ctnArrSum.filter((a) => a.cnt > 71)
    // console.log(ctnArrSumBig[0]);

    ctnArrSumBig.sort((a, b) => a.cnt - b.cnt);

    const cartons = Object.keys(ctns);

    const keyCartons = [];

    cartons.map((carton) => {
        const match = ctnArrSumBig.find((item) => item.mx === ctns[carton].toString());
        // console.log(match);
        if (match !== undefined) {
            keyCartons.push(carton);
        }
    })

    // const columns1 = [
    //     { "key": "mx", "name": "mix", "idx": 1, "type": "string" },
    //     { "key": "cnt", "name": "cartons", "idx": 2, "type": "number" },
    // ]
    // addWS(wb1, 'key cartons', columns1, ctnArrSumBig);
    // wb1.write('ExcelFile2.xlsx')
    return keyCartons;
}


// findKeyAccounts();

export default findKeyAccounts;



