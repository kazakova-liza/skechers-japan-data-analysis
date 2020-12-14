import { executeQuery } from '../sql/executeQuery.js'
import groupBy from '../../utils/groupBy.js'
import createCrossTab from '../../utils/createCrossTab.js'
import xl from 'excel4node'
import addWS from '../../utils/addWS.js'


const createCartonTypesStats = async () => {
    const query = `SELECT wave, cartonType, COUNT(*) as count
                    FROM japan2.cartons
                    WHERE vasTime > 0
                    GROUP BY wave, cartonType`;
    const data = await executeQuery('getSpecificData', undefined, query);
    // console.log(data[0]);

    const xTabConfig = {
        rowKey: "wave",
        colKey: "cartonType",
        sum: "count"
    };

    const xtab = createCrossTab(data, xTabConfig);

    // console.log(xtab);

    const ifArea = xtab.res.map((item) => {
        item.cases = 0;
        item.active = item.active === undefined ? 0 : item.active;
        item.FC = item.FC === undefined ? 0 : item.FC;
        item.key = item.key === undefined ? 0 : item.key;
        item.POP = item.POP === undefined ? 0 : item.POP;
        item.SOCKS = item.SOCKS === undefined ? 0 : item.SOCKS;

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
    const waveByCartonType = groupBy(ifArea, groupByConfig);

    return {
        xtab,
        waveByCartonType
    };
}
createCartonTypesStats();

export default createCartonTypesStats;