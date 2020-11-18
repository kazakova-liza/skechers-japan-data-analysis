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

    const result = data.map((data) => {
        return [data.carton, data.pickTicket, data.wave, data.pallet, data.psGenerated, data.psGeneratedOnCarton, data.crtStatus, data.crtSize, data.crtStatusFromHeader, data.style, data.color, data.size, data.sku, data.packedUnit, data.toBePick, data.crtStatusFromCrt, data.leadTime, data.soldTo, data.shipTo, data.pickTicketStatus, data.orderType, data.carrier, data.printCode, data.generatedDate, data.leaveDate, data.stopShipDate, data.customer, data.division, data.dcNumber, data.aeonStDc, data.zipCode, data.combinePt];
    })

    const fields = 'carton, pickTicket, wave,  pallet, psGenerated, psGeneratedOnCarton, crtStatus, crtSize, crtStatusFromHeader, style, color, size, sku, packedUnit, toBePick, crtStatusFromCrt, leadTime, soldTo, shipTo, pickTicketStatus, orderType, carrier, printCode, generatedDate, leaveDate, stopShipDate, customer, division, dcNumber, aeonStDc, zipCode, combinePt';
    const newTable = 'orders';

    await executeQuery('write', newTable, undefined, result, fields);
}

buildOrdersStatistics();