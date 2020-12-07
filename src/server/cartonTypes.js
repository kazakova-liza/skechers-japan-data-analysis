import { executeQuery } from './sql/executeQuery.js'
import groupBy from '../utils/groupBy.js'
import createCrossTab from '../utils/createCrossTab.js'
import xl from 'excel4node'
import addWS from '../utils/addWS.js'
import createColumnsArray from '../server/createColumnsArray.js'


const calculateCartonTypesStats = async () => {
    const query = `SELECT wave, cartonType, COUNT(*) as count
                    FROM japan2.cartons
                    WHERE vasTime > 0
                    GROUP BY wave, cartonType`;
    const data = await executeQuery('getSpecificData', undefined, query);
    console.log(data[0]);

    const xTabConfig = {
        rowKey: "wave",
        colKey: "cartonType",
        sum: "count"
    };

    const wb1 = new xl.Workbook();
    const xtab = createCrossTab(data, xTabConfig);
    // console.log(xtab);

    const ws = wb1.addWorksheet('cartonTypes');
    addWS(ws, xtab.colsArr, xtab.res);

    const ifArea = xtab.res.map((item) => {
        item.cases = 0;
        item.isActive = item.active > 0 ? true : false;
        item.cases += item.active > 0 ? item.active : 0;
        item.isFc = item.FC > 0 ? true : false;
        item.cases += item.FC > 0 ? item.FC : 0;
        item.isPop = item.POP > 0 ? true : false;
        item.cases += item.POP > 0 ? item.POP : 0;
        item.isKey = item.key > 0 ? true : false;
        item.cases += item.key > 0 ? item.key : 0;
        item.isSocks = item.SOCKS > 0 ? true : false;
        item.cases += item.SOCKS > 0 ? item.SOCKS : 0;

        return item;
    })

    const groupByConfig = {
        bys: ['isActive', 'isFc', 'isPop', 'isKey', 'isSocks'],
        sums: ['cases']
    }
    const result = groupBy(ifArea, groupByConfig);

    const ws1 = wb1.addWorksheet('waveByCartonType');
    const columns = createColumnsArray(result[0]);
    addWS(ws1, columns, result);

    // console.log(result);

    wb1.write(`cartonTypes.xlsx`);
    console.log('statistics has been written to the spreadsheet');

}

calculateCartonTypesStats();