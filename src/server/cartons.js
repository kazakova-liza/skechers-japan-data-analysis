import executeQuery from './sql/executeQuery.js'
import groupBy from '../utils/groupBy.js'


const buildCartonsTable = async () => {
    const table = 'orders';

    const data = await executeQuery('getAllData', table);
    console.log(data[0]);

    const bys = ['carton', 'leaveDate', 'customer', 'printCode', 'soldTo', 'shipTo', 'wave', 'qty', 'division'];
    const sums = ['packedUnit_int'];
    const dcnts = [];

    const grouppedData = groupBy(data, bys, sums, dcnts);
    console.log(grouppedData[0]);

    grouppedData.map((carton) => {
        const popDivisions = ['Y', 'Z', 'ZZ', 'YSF', 'YYM'];
        if (popDivisions.includes(carton.division)) {
            carton.cartonType = 'POP';
        }
        else if (carton.division === 'SOCKS') {
            carton.cartonType = 'SOCKS';
        }
        else if ()
            if (carton.cnt === 1 && carton.packedUnit_int_sum >= qty) {
                carton.cartonType = 'FC';
            }

    })


    // const result = data.map((data) => {
    //     return [data.cust];
    // })

    // const fields = 'custNumber';
    // const newTable = 'cust';

    // await executeQuery('write', newTable, undefined, result, fields);
}

buildCartonsTable();