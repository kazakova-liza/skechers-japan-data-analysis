import executeQuery from './sql/executeQuery.js'
import groupBy from '../utils/groupBy.js'
import findKeyAccounts from './keyAccounts.js'


const buildCartonsTable = async () => {
    const table = 'orders';

    const data = await executeQuery('getAllData', table);
    console.log(data[0]);

    let bys = ['carton', 'leaveDate', 'customer', 'printCode', 'soldTo', 'shipTo', 'wave', 'qty', 'division'];
    let sums = ['packedUnit_int'];
    let dcnts = [];

    const grouppedData = groupBy(data, bys, sums, dcnts);
    // console.log(grouppedData[0]);

    const keyAccounts = findKeyAccounts(data);
    //let keyAccountObj = {};
    //keyAccounts.map((item) => {
    //    keyAccountObj[item] = true;
    //})
    console.log(keyAccounts[0]);

    grouppedData.map((item) => {
        item.bom = -1
        const popDivisions = ['Y', 'Z', 'ZZ', 'YSF', 'YYM'];
        if (popDivisions.includes(item.division)) {
            item.cartonType = 'POP';
        }
        else if (item.division === 'YSO') {
            item.cartonType = 'SOCKS';
        }
        else if (item.carton in keyAccounts) {
            item.cartonType = 'key';
            item.bom = keyAccounts[item.carton]
        }
        else if (item.cnt === 1 && item.packedUnit_int_sum >= 6) {
            item.cartonType = 'FC';
        }
        else {
            item.cartonType = 'active';
        }
        // console.log(item);

    })

    const result = grouppedData.map((data) => {
        //return [data.carton, data.leaveDate, data.customer, data.printCode, data.shipTo, data.wave, data.cnt, data.packedUnit_int_sum, data.cartonType];
        return [data.carton, data.leaveDate, data.customer, data.soldTo, data.printCode, data.shipTo, data.wave, data.cnt, data.packedUnit_int_sum, data.cartonType, data.bom];
    })

    //const fields = 'carton, leaveDate, customer, printCode, shipTo, wave, lines, units, cartonType';
    const fields = 'carton, leaveDate, customer, soldTo, printCode, shipTo, wave, lines2, units, cartonType, bom';
    const newTable = 'cartons';

    await executeQuery('write', newTable, undefined, result, fields);
}

buildCartonsTable();