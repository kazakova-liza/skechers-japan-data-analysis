import executeQuery from './sql/executeQuery.js'
import xl from 'excel4node'
import addWS from '../utils/addWS.js'
import groupBy from '../utils/groupBy.js'


const test1 = async () => {
    const wb1 = new xl.Workbook();
    // const table = 'orders';
    const query = `SELECT left(wave,8) as wdate, CONCAT("b", bom) as bom, count(*) as cartons 
                    FROM japan2.cartons
                    WHERE bom != -1
                    GROUP BY 1,2`;

    const data = await executeQuery('getSpecificData', undefined, query);
    console.log(data[0]);
    let xtab = {}
    let xtabIn = {"rowKey":"bom", "colKey":"wdate", "sum":"cartons"}
    data.forEach(element => {
        if (!(element[xtabIn.rowKey] in xtab)){
            xtab[element[xtabIn.rowKey]] = {}
        }
        if (!(element[xtabIn.colKey] in xtab[element[xtabIn.rowKey]])){
            xtab[element[xtabIn.rowKey]][element[xtabIn.colKey]] = 0
        }
        xtab[element[xtabIn.rowKey]][element[xtabIn.colKey]] += element[xtabIn.sum]
    })
    let xtabRes = []
    let xtabColsObj = {}
    let objIdx = 1
    Object.keys(xtab).forEach((key) => {
        xtab[key].key = key
        xtabRes.push(xtab[key])
        Object.keys(xtab[key]).forEach((col) => {
            if (!(col in xtabColsObj)){
                let ob = {}
                ob.key = col
                ob.name = col
                ob.idx = objIdx++
                ob.type = 'number'
                xtabColsObj[col] = ob
            }
        })
    })
    xtabColsObj.key.type = 'string'
    let xtabColsArr = Object.values(xtabColsObj)
    addWS(wb1, 'bom', xtabColsArr, xtabRes);
    wb1.write('ExcelFile3.xlsx')
    

}

test1();