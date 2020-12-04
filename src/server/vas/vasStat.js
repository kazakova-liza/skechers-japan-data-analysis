import { executeQuery } from '../sql/executeQuery.js'
import vasByDate from './vasByDate.js';
import vasByCustomer from './vasByCustomer.js'
import xl from 'excel4node'
import addWS from '../../utils/addWS.js'
import createColumnsArray from '../createColumnsArray.js'
import addCalculations from '../addCalculations.js'


const createVasStat = async () => {

    const query = `SELECT carton, soldTo,
                    shipTo, wave, units, left(wave, 8) as wdate,
                    inspection, shoeTag, shoeBoxLabel, cartonLabel, left(customer, 9) as scust, cartonType, vasTime
                    FROM japan2.cartons`;

    const data = await executeQuery('getSpecificData', undefined, query);
    console.log(data[0]);

    const byDate = vasByDate(data);
    const byCustomer = vasByCustomer(data);
    const keyAccounts = data.filter((item) => item.cartonType === 'key');
    console.log(keyAccounts)
    const fullCases = data.filter((item) => item.cartonType === 'FC');
    const active = data.filter((item) => item.cartonType === 'active');
    const keyAccountsVas = vasByDate(keyAccounts);
    const fullCasesVas = vasByDate(fullCases);
    const activeVas = vasByDate(active);

    return {
        byDate,
        byCustomer,
        keyAccountsVas,
        fullCasesVas,
        activeVas
    };
}

const main = async () => {
    const statistics = await createVasStat();
    // console.log(statistics);
    const wb1 = new xl.Workbook();

    const byDateColumns = createColumnsArray(statistics.byDate[0]);

    const ws = wb1.addWorksheet('by date');
    addWS(ws, byDateColumns, statistics.byDate);
    addCalculations(ws, byDateColumns, statistics.byDate);

    const byCustColumns = createColumnsArray(statistics.byCustomer[0]);

    const ws1 = wb1.addWorksheet('by cust');
    addWS(ws1, byCustColumns, statistics.byCustomer);
    addCalculations(ws1, byCustColumns, statistics.byCustomer);


    const ws2 = wb1.addWorksheet('key accounts');
    addWS(ws2, byDateColumns, statistics.keyAccountsVas);
    addCalculations(ws2, byDateColumns, statistics.keyAccountsVas);

    const ws3 = wb1.addWorksheet('FC');
    addWS(ws3, byDateColumns, statistics.fullCasesVas);
    addCalculations(ws3, byDateColumns, statistics.fullCasesVas);

    const ws4 = wb1.addWorksheet('active');
    addWS(ws4, byDateColumns, statistics.activeVas);
    addCalculations(ws4, byDateColumns, statistics.activeVas);

    wb1.write(`vas.xlsx`);
    console.log('done');
}

main();