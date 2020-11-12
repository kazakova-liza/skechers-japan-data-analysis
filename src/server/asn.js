import executeQuery from './sql/executeQuery.js'
import groupBy from '../utils/groupBy.js'


const buildAsnStatistics = async () => {
    const table = 'asn';
    const query = `SELECT *
                    from japan2.${table}
                    where recRtn != 'Return'`;
    const data = await executeQuery('getSpecificData', table, query);
    console.log(data[0]);
    const bys = ['shipment', 'sku', 'style', 'color', 'size', 'receiveDate', 'verifiedDate'];
    const sums = ['casesVerified', 'unitsVerified'];
    const dcnts = [];

    const grouppedData = groupBy(data, bys, sums, dcnts);

    const processedData = grouppedData.map((item) => {
        const palletsQty = item.casesVerified_sum / 24;

        let volBand;
        if (palletsQty > 3) {
            volBand = 'A';
        }
        else if (palletsQty > 1 && palletsQty <= 3) {
            volBand = 'B';
        }
        else if (palletsQty <= 1 && palletsQty >= 0.5) {
            volBand = 'C';
        }
        else {
            volBand = 'D';
        }
        item.palletsQty = Math.ceil(palletsQty);
        item.pallEquiv = palletsQty;
        item.volBand = volBand;
        return item;
    })
    // console.log(processedData);
    const result = processedData.map((data) => {
        return [data.shipment, data.receiveDate, data.verifiedDate, data.style, data.color, data.size, data.sku, data.unitsVerified_sum, data.casesVerified_sum, data.palletsQty, data.pallEquiv, data.volBand];
    })
    console.log(result);

    const fields = 'shipment, receivedDate, verifiedDate, style, color, size, sku, units, cases, pallets, pallEquiv, volBand';

    // const resultChunked = lodash.chunk(result, 10);

    const newTable = 'sasn';

    await executeQuery('write', newTable, undefined, result, fields);
}

buildAsnStatistics();