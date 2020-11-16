import executeQuery from './sql/executeQuery.js'
import groupBy from '../utils/groupBy.js'
import xl from 'excel4node'
import addWS from '../utils/addWS.js'


const buildShipmentsStatistics = async () => {
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
                        pallEquiv_sum: 0
                    }
                }
            })
        }
        else {
            allVolBands = volBands;
        }
        allVolBands.map((el) => {
            item[el.volBand] = {};
            item[el.volBand].dSkus = el.sku_dcnt;
            item[el.volBand].cases = el.cases_sum;
            item[el.volBand].units = el.units_sum;
            item[el.volBand].palletsSum = el.pallets_sum;
            item[el.volBand].pallEquivsSum = el.pallEquiv_sum;
        })
        return item;
    })
    return result;
}

const main = async () => {
    const statistics = await buildShipmentsStatistics();
    console.log(statistics);
    const workBook = new xl.Workbook();
    const columns = [
        { key: "shipment", name: "shipment", idx: 1, type: "string" },
        { key: "cases_sum", name: "cases", idx: 2, type: "number" },
        { key: "units_sum", name: "units", idx: 3, type: "number" },
        { key: "sku_dcnt", name: "dSkus", idx: 4, type: "number" },
        { key: "style_dcnt", name: "dStyles", idx: 5, type: "number" },
        { key: "A.dSkus", name: "aSkus", idx: 6, type: "number" },
        { key: "A.cases", name: "aCases", idx: 7, type: "number" },
        { key: "A.units", name: "aUnits", idx: 8, type: "number" },
        { key: "A.palletsSum", name: "aPalletsSum", idx: 9, type: "number" },
        { key: "A.pallEquivsSum", name: "aPallEquivsSum", idx: 10, type: "number" },
        { key: "A.dSkus", name: "bSkus", idx: 6, type: "number" },
        { key: "B.cases", name: "bCases", idx: 7, type: "number" },
        { key: "B.units", name: "bUnits", idx: 8, type: "number" },
        { key: "B.palletsSum", name: "bPalletsSum", idx: 9, type: "number" },
        { key: "B.pallEquivsSum", name: "bPallEquivsSum", idx: 10, type: "number" },
        { key: "C.dSkus", name: "cSkus", idx: 6, type: "number" },
        { key: "C.cases", name: "cCases", idx: 7, type: "number" },
        { key: "C.units", name: "cUnits", idx: 8, type: "number" },
        { key: "C.palletsSum", name: "cPalletsSum", idx: 9, type: "number" },
        { key: "C.pallEquivsSum", name: "cPallEquivsSum", idx: 10, type: "number" },
        { key: "D.dSkus", name: "dSkus", idx: 6, type: "number" },
        { key: "D.cases", name: "dCases", idx: 7, type: "number" },
        { key: "D.units", name: "dUnits", idx: 8, type: "number" },
        { key: "D.palletsSum", name: "dPalletsSum", idx: 9, type: "number" },
        { key: "D.pallEquivsSum", name: "dPallEquivsSum", idx: 10, type: "number" },
    ]
    addWS(workBook, 'asn_shipments', columns, statistics);
    workBook.write(`asn_shipments.xlsx`);
}

main();