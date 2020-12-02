import { executeQuery } from '../sql/executeQuery.js'
import groupBy from '../../utils/groupBy.js'


const createShipmentsStatistics = async () => {
    const table = 'sasn';
    const query = `WITH temp as (SELECT shipment, sum(cases) as sum
				                FROM japan2.${table}
				                group by shipment
				                having sum >= 100)  
                SELECT *
                FROM japan2.${table} ${table}
                inner join temp
                on temp.shipment = ${table}.shipment
                order by ${table}.shipment`;

    const data = await executeQuery('getSpecificData', table, query);
    console.log(data[0]);
    let bys = ['shipment'];
    let sums = ['cases', 'units'];
    let dcnts = ['sku', 'style',];

    const grouppedByShipment = groupBy(data, bys, sums, dcnts);

    bys = ['shipment', 'volBand'];
    sums = ['cases', 'units', 'pallets', 'pallEquiv'];
    dcnts = ['sku'];

    const grouppedByShipmentVolBand = groupBy(data, bys, sums, dcnts);

    // console.log(grouppedByShipmentVolBand);
    const result = grouppedByShipment.map((item) => {
        const volBands = grouppedByShipmentVolBand.filter((el) => el.shipment === item.shipment);
        let allVolBands;
        if (volBands.length !== 4) {
            const bands = ['A', 'B', 'C', 'D'];
            allVolBands = volBands.map((item) => {
                if (bands.includes(item.volBand)) {
                    return item;
                }
                else {
                    return {
                        sku_dcnt: 0,
                        cases_sum: 0,
                        units_sum: 0,
                        pallets_sum: 0,
                        pallEquiv_sum: 0,
                    }
                }
            })
        }
        else {
            allVolBands = volBands;
        }
        item.abBandsPalletsSum = 0;
        item.cdBandCasesSum = 0;
        allVolBands.map((el) => {
            item[el.volBand] = {};
            item[el.volBand].dSkus = el.sku_dcnt;
            item[el.volBand].cases = el.cases_sum;
            item[el.volBand].units = el.units_sum;
            item[el.volBand].palletsSum = el.pallets_sum;
            item[el.volBand].pallEquivsSum = el.pallEquiv_sum;

            if (el.volBand === 'A' || el.volBand === 'B') {
                item.abBandsPalletsSum += el.pallets_sum;
            }
            if (el.volBand === 'D' || el.volBand === 'C') {
                item.cdBandCasesSum += el.cases_sum;
            }
        })
        return item;
    })
    return result;
}

export default createShipmentsStatistics;