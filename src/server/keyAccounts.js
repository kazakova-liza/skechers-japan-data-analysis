import { executeQuery } from './sql/executeQuery.js'
import groupBy from '../utils/groupBy.js'
import xl from 'excel4node'
import addWS from '../utils/addWS.js'


const findKeyAccounts = async (allOrds) => {

    console.log(allOrds[0]);

    var ctns = {}
    allOrds.forEach((act) => {
        if (act.packedUnit > 0) {
            if (!(act.carton in ctns)) {
                ctns[act.carton] = []
                ctns[act.carton].push('_' + act.wdate)
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
        if (val.length > 2) {
            ctnArr.push({ 'mx': val.toString() })
        }
    }

    const config = {
        bys: ['mx']
    }

    const ctnArrSum = groupBy(ctnArr, config)

    var ctnArrSumBig = ctnArrSum.filter((a) => a.cnt > 50)
    // console.log(ctnArrSumBig[0]);

    //ctnArrSumBig.sort((a, b) => a.cnt - b.cnt);
    let bominc = 0
    ctnArrSumBig.forEach((mix) => {
        mix.bom = bominc++
    })

    const cartons = Object.keys(ctns);

    const keyCartons = [];
    const keyCartonsArr = {}

    cartons.map((carton) => {
        const match = ctnArrSumBig.find((item) => item.mx === ctns[carton].toString());
        // console.log(match);
        if (match !== undefined) {
            keyCartonsArr[carton] = match.bom
            //keyCartons.push(carton);
        }
    })
    //const wb1 = new xl.Workbook();
    // const columns1 = [
    //     { "key": "mx", "name": "mix", "idx": 1, "type": "string" },
    //     { "key": "cnt", "name": "cartons", "idx": 2, "type": "number" },
    // ]
    // addWS(wb1, 'key cartons', columns1, ctnArrSumBig);
    // wb1.write('ExcelFile2.xlsx')
    return keyCartonsArr;
}


export default findKeyAccounts;



