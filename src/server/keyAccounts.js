import executeQuery from './sql/executeQuery.js'
import groupBy from '../utils/groupBy.js'
import xl from 'excel4node'
import addWS from '../utils/addWS.js'


const main = async () => {
    const wb1 = new xl.Workbook();

    const table = 'orders';
    const allOrds = await executeQuery('getAllData', table);

    console.log(allOrds[0]);

    console.log(`part1`);
    var ctns = {}
    allOrds.forEach((act) => {
        if (act.packedUnit > 0) {
            if (!(act.carton in ctns)) {
                ctns[act.carton] = []
            }
            ctns[act.carton].push(act.sku + '-' + act.packedUnit.toString())
        }
    })
    console.log(`part2`);
    console.log(ctns.length);

    for (const val of Object.values(ctns)) {
        val.sort()
    }
    var ctnArr = []

    console.log(`part3`);
    for (const val of Object.values(ctns)) {
        if (val.length > 1) {
            ctnArr.push({ 'mx': val.toString() })
        }
    }
    console.log(`part4`);
    console.log(ctnArr.length);
    console.log(ctnArr[0]);

    const ctnArrSum = groupBy(ctnArr, ['mx'], [], [])

    console.log(`part5`);
    console.log(ctnArrSum.length)

    var ctnArrSumBig = ctnArrSum.filter((a) => a.cnt > 71)
    ctnArrSumBig.sort((a, b) => a.cnt - b.cnt)
    const columns1 = [
        { "key": "mx", "name": "mix", "idx": 1, "type": "string" },
        { "key": "cnt", "name": "cartons", "idx": 2, "type": "number" },
    ]
    addWS(wb1, 'key cartons', columns1, ctnArrSumBig);
    wb1.write('ExcelFile2.xlsx')
}


main();



