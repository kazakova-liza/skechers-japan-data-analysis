import { executeQuery } from '../sql/executeQuery.js'
import vasByDate from './vasByDate.js';
import vasByCustomer from './vasByCustomer.js'
import xl from 'excel4node'
import addWS from '../../utils/addWS.js'


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
    const workBook = new xl.Workbook();
    const columns1 = [
        { key: "date", name: "date", idx: 1, type: "string" },
        { key: "unitsInspection", name: "unitsInspection", idx: 2, type: "number" },
        { key: "cartonsInspection", name: "cartonsInspection", idx: 3, type: "number" },
        { key: "unitsShoeTag", name: "unitsShoeTag", idx: 4, type: "number" },
        { key: "cartonsShoeTag", name: "cartonsShoeTag", idx: 5, type: "number" },
        { key: "unitsShoeBoxLabel", name: "unitsShoeBoxLabel", idx: 6, type: "number" },
        { key: "cartonsShoeBoxLabel", name: "cartonsShoeBoxLabel", idx: 7, type: "number" },
        { key: "unitsCartonLabel", name: "unitsCartonLabel", idx: 8, type: "number" },
        { key: "cartonsCartonLabel", name: "cartonsCartonLabel", idx: 9, type: "number" },
        { key: "vasCtns", name: "vasCtns", idx: 10, type: "number" },
        { key: "vasUnits", name: "vasUnits", idx: 11, type: "number" },
        { key: "vasTime", name: "vasTime", idx: 12, type: "number" },
    ]
    addWS(workBook, 'by date', columns1, statistics.byDate);
    workBook.write(`vas.xlsx`);

    const columns2 = [
        { key: "cust", name: "cust", idx: 1, type: "string" },
        { key: "unitsInspection", name: "unitsInspection", idx: 2, type: "number" },
        { key: "cartonsInspection", name: "cartonsInspection", idx: 3, type: "number" },
        { key: "unitsShoeTag", name: "unitsShoeTag", idx: 4, type: "number" },
        { key: "cartonsShoeTag", name: "cartonsShoeTag", idx: 5, type: "number" },
        { key: "unitsShoeBoxLabel", name: "unitsShoeBoxLabel", idx: 6, type: "number" },
        { key: "cartonsShoeBoxLabel", name: "cartonsShoeBoxLabel", idx: 7, type: "number" },
        { key: "unitsCartonLabel", name: "unitsCartonLabel", idx: 8, type: "number" },
        { key: "cartonsCartonLabel", name: "cartonsCartonLabel", idx: 9, type: "number" },
        { key: "vasCtns", name: "vasCtns", idx: 10, type: "number" },
        { key: "vasUnits", name: "vasUnits", idx: 11, type: "number" },
        { key: "vasTime", name: "vasTime", idx: 12, type: "number" },
    ]
    addWS(workBook, 'by cust', columns2, statistics.byCustomer);
    workBook.write(`vas.xlsx`);

    console.log(statistics.keyAccountsVas);
    addWS(workBook, 'key accounts', columns1, statistics.keyAccountsVas);
    workBook.write(`vas.xlsx`);
    addWS(workBook, 'FC', columns1, statistics.fullCasesVas);
    workBook.write(`vas.xlsx`);
    addWS(workBook, 'active', columns1, statistics.activeVas);
    workBook.write(`vas.xlsx`);
}

main();