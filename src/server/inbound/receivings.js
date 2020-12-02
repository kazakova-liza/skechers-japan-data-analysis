import { executeQuery } from '../sql/executeQuery.js'
import groupBy from '../../utils/groupBy.js'

const createDailyReceivingStats = async () => {
    const table = 'sasn';
    const types = ['greaterThan100Cases', 'lessThan100Cases'];
    let condition;
    let stats = {};

    for (const type of types) {
        if (type === 'greaterThan100Cases') {
            condition = 'sum >= 100';
        }
        else {
            condition = 'sum < 100';
        }
        const query = `WITH temp as (SELECT verifiedDate, shipment, sum(cases) as sum
				                FROM japan2.${table}
				                group by verifiedDate, shipment
				                having ${condition})  
                SELECT *
                FROM japan2.${table} ${table}
                inner join temp
                on temp.verifiedDate = ${table}.verifiedDate
                and temp.shipment = ${table}.shipment
                order by ${table}.shipment`;

        const data = await executeQuery('getSpecificData', table, query);
        console.log(data[0]);

        let bys = ['verifiedDate'];
        let sums = ['pallets', 'pallEquiv', 'cases', 'units'];
        let dcnts = ['shipment', 'sku', 'style'];

        const grouppedByDate = groupBy(data, bys, sums, dcnts);
        console.log(type);

        console.log(grouppedByDate[0]);

        bys = ['verifiedDate', 'volBand'];
        sums = ['pallets', 'cases'];
        dcnts = [];

        const grouppedByDateVolBand = groupBy(data, bys, sums, dcnts);

        const result = grouppedByDate.map((item) => {
            const volBands = grouppedByDateVolBand.filter((el) => el.verifiedDate === item.verifiedDate);
            let abBandsPalletsSum = 0;
            let cdBandCasesSum = 0;
            volBands.map((el) => {
                if (el.volBand === 'A' || el.volBand === 'B') {
                    abBandsPalletsSum += el.pallets_sum;
                }
                if (el.volBand === 'D' || el.volBand === 'C') {
                    cdBandCasesSum += el.cases_sum;
                }
            });
            return {
                date: item.verifiedDate,
                containers: item.shipment_dcnt,
                palletsSum: item.pallets_sum,
                pallEquivSum: item.pallEquiv_sum,
                casesSum: item.cases_sum,
                unitsSum: item.units_sum,
                dSkus: item.sku_dcnt,
                dStyles: item.style_dcnt,
                abBandsPalletsSum,
                cdBandCasesSum
            }
        })
        stats[type] = result;
    };
    return stats;
}


export default createDailyReceivingStats;