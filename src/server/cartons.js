import executeQuery from './sql/executeQuery.js'
import groupBy from '../utils/groupBy.js'
import findKeyAccounts from './keyAccounts.js'


const buildCartonsTable = async () => {


    const query = `SELECT carton, leaveDate, customer, printCode, soldTo, shipTo, wave, division, packedUnit, sku, left(wave, 8) as wdate, vas 
                    FROM japan2.orders`;

    const data = await executeQuery('getSpecificData', undefined, query);


    let bys = ['carton', 'leaveDate', 'customer', 'printCode', 'soldTo', 'shipTo', 'wave', 'qty', 'division', 'vas'];
    let sums = ['packedUnit'];
    let dcnts = [];

    const grouppedData = groupBy(data, bys, sums, dcnts);

    const keyAccounts = findKeyAccounts(data);

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
        else if (item.cnt === 1 && item.packedUnit_sum >= 6) {
            item.cartonType = 'FC';
        }
        else {
            item.cartonType = 'active';
        }


    })

    const result = grouppedData.map((data) => {
         return [data.carton, data.leaveDate, data.customer, data.soldTo, data.printCode, data.shipTo, data.wave, data.cnt, data.packedUnit_sum, data.cartonType, data.bom, data.vas];
    })

    const fields = 'carton, leaveDate, customer, soldTo, printCode, shipTo, wave, lines2, units, cartonType, bom, vas';
    const newTable = 'cartons';

    await executeQuery('write', newTable, undefined, result, fields, true);

    const sql3 = `ALTER TABLE japan2.orders ADD COLUMN cartonType VARCHAR(45) NULL AFTER id;`
    const res3 = await executeQuery('getSpecificData', undefined, sql3);
    console.log(res3)

    const sql4 = `UPDATE orders INNER JOIN cartons ON orders.carton = cartons.carton SET orders.cartonType = cartons.cartonType `
    const res4 = await executeQuery('getSpecificData', undefined, sql4);
    console.log(res4)
}

buildCartonsTable();