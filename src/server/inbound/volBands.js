import { executeQuery } from '../sql/executeQuery.js'


const getVolBandStatistics = async () => {
    let condition;
    const types = ['greaterThan100Cases', 'lessThan100Cases'];
    let result = {};

    for (const type of types) {
        if (type === 'greaterThan100Cases') {
            condition = 'sum >= 100';
        }
        else {
            condition = 'sum < 100';
        }

        const query = `with temp as (select shipment, sum(cases) as sum
				from japan2.sasn
                group by shipment
                having ${condition})

                SELECT volBand, COUNT(*), SUM(units), SUM(cases) as sumCases, SUM(pallets), 
                SUM(pallequiv), count(distinct sku), count(distinct sasn.shipment) as shipments
                FROM japan2.sasn sasn
                INNER JOIN temp
                ON temp.shipment = sasn.shipment
                GROUP BY volBand`;

        const data = await executeQuery('getSpecificData', undefined, query);
        result[type] = data;
    }
    // console.log(result);
    return result;
}

export default getVolBandStatistics;