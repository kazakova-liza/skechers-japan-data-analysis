
import groupBy from '../utils/groupBy.js'


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
    return keyCartonsArr;
}


export default findKeyAccounts;



