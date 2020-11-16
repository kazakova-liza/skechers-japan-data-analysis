import executeQuery from './sql/executeQuery.js'
// import groupBy from '../utils/groupBy.js'


const buildCustomersTable = async () => {
    // const table = 'orders';
    const query = `SELECT distinct(soldTo) as cust
                    FROM japan2.orders`;

    const data = await executeQuery('getSpecificData', undefined, query);
    console.log(data[0]);

    const result = data.map((data) => {
        return [data.cust];
    })

    const fields = 'custNumber';
    const newTable = 'cust';

    await executeQuery('write', newTable, undefined, result, fields);
}

buildCustomersTable();