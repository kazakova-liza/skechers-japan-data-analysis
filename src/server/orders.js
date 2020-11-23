import executeQuery from './sql/executeQuery.js'
// import groupBy from '../utils/groupBy.js'


const buildOrdersStatistics = async () => {
    // const table = 'asn';
    const query = `SELECT a.carton, a.pickTicket, a.wave, a.pallet, a.psGenerated,
                    a.psGeneratedOnCarton, a.crtStatus, a.crtSize, 
                    a.status as crtHeaderStatus, b.style, b.color, 
                    b.size, b.sku, b.packedUnit, b.toBePick, 
                    b.status as crtStatus, c.leadTime, c.soldTo, 
                    c.shipTo, c.status as pickTicketStatus, 
                    c.orderType, c.carrier, c.printCode, c.generatedDate, 
                    c.leaveDate, c.stopShipDate, c.customer, c.division, 
                    c.dcNumber, c.aeonStDc, c.zipCode, c.combinePt
                    FROM japan2.o_ctnHeader a
                    inner JOIN japan2.o_ctnDetail b
                    ON a.carton = b.crtNumber
                    INNER JOIN japan2.o_ptHeader c
                    ON c.pickTicket = a.pickTicket`;

    const data = await executeQuery('getSpecificData', undefined, query);
    console.log(data[0]);

    const itemVAS = ['10003', '10004', '10005', '10006', '10007', '10018', '10032', '10036',
    '10037', '10040', '10041', '10047', '10057', '10059', '10063',
    '10072', '10082', '10083', '10005', '10015', '10047'];
    const cartonVAS = ['10003', '10005', '10008', '10009', '10010', '10011',
    '10015', '10018', '10032', '10036', '10038', '10039', '10041', '10047',
    '10054', '10063', '10074', '10080', '10005', '10015', '10047'];

    //let vasCodes = [];

    //data.map((item) => {
    data.forEach((item) => {
        let vas;
        if (itemVAS.includes(item.soldTo) && !cartonVAS.includes(item.soldTo)) {
            vas = 'item';
        }
        if (!itemVAS.includes(item.soldTo) && cartonVAS.includes(item.soldTo)) {
            vas = 'carton';
        }
        if (itemVAS.includes(item.soldTo) && cartonVAS.includes(item.soldTo)) {
            vas = 'both';
        }
        if (!itemVAS.includes(item.soldTo) && !cartonVAS.includes(item.soldTo)) {
            vas = 'none';
        }
        item.vas = vas
    })




    const result = data.map((data) => {
        return [data.carton, data.pickTicket, data.wave, data.pallet, data.psGenerated, data.psGeneratedOnCarton, data.crtStatus, data.crtSize, data.crtStatusFromHeader, data.style, data.color, data.size, data.sku, data.packedUnit, data.toBePick, data.crtStatusFromCrt, data.leadTime, data.soldTo, data.shipTo, data.pickTicketStatus, data.orderType, data.carrier, data.printCode, data.generatedDate, data.leaveDate, data.stopShipDate, data.customer, data.division, data.dcNumber, data.aeonStDc, data.zipCode, data.combinePt, data.vas];
    })

    const fields = 'carton, pickTicket, wave,  pallet, psGenerated, psGeneratedOnCarton, crtStatus, crtSize, crtStatusFromHeader, style, color, size, sku, packedUnit, toBePick, crtStatusFromCrt, leadTime, soldTo, shipTo, pickTicketStatus, orderType, carrier, printCode, generatedDate, leaveDate, stopShipDate, customer, division, dcNumber, aeonStDc, zipCode, combinePt, vas';
    const newTable = 'orders';

    await executeQuery('write', newTable, undefined, result, fields, true);
}

buildOrdersStatistics();