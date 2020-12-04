import { executeQuery } from '../sql/executeQuery.js'
import groupBy from '../../utils/groupBy.js'


const createReturnsStatistics = async () => {
    const table = 'o_asn';
    const query = `SELECT *
                    from japan2.${table}
                    where recRtn = 'Return'`;

    const data = await executeQuery('getSpecificData', table, query);
    console.log(data[0]);

    const config = {
        bys: ['verifiedDate'],
        sums: ['unitsVerified'],
        dcnts: ['sku']
    }

    const grouppedData = groupBy(data, config);
    return grouppedData;
}

export default createReturnsStatistics;

