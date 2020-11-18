import executeQuery from './sql/executeQuery.js'
// import groupBy from '../utils/groupBy.js'


const buildCustomersTable = async () => {
    // const table = 'orders';
    const query = `SELECT soldto, customer, COUNT(*) as lines 
                    FROM japan2.orders GROUP BY soldto, customer`;

    const data = await executeQuery('getSpecificData', undefined, query);
    console.log(data[0]);

    const result = data.map((data) => {
        return [data.cust, data.customer, data.lines];
    })

    const fields = 'custNumber, custName, lines';
    const newTable = 'cust';

    await executeQuery('write', newTable, undefined, result, fields, true);
}

buildCustomersTable();