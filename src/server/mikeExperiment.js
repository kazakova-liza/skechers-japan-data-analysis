import executeQuery from './sql/executeQuery.js'
import xl from 'excel4node'
import addWS from '../utils/addWS.js'
import groupBy from '../utils/groupBy.js'


const test1 = async () => {
    const wb1 = new xl.Workbook();

    // let query = `SELECT left(wave,8) as wdate, cartonType, count(*) as cartons 
    //                 FROM japan2.cartons
    //                 GROUP BY 1,2`;
    // let xtabIn = {"rowKey":"wdate", "colKey":"cartonType", "sum":"cartons"}

    let query = `SELECT left(wave,8) as wdate, cartonType, sum(units) as units 
                    FROM japan2.cartons
                    GROUP BY 1,2`;
    let xtabIn = {"rowKey":"wdate", "colKey":"cartonType", "sum":"units"}



    let data = await executeQuery('getSpecificData', undefined, query);
    console.log(data[0]);
    let xtab = {}
    
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
    let objIdx = 2
    Object.keys(xtab).forEach((row) => {
        xtab[row][xtabIn.rowKey] = row
        xtabRes.push(xtab[row])
        Object.keys(xtab[row]).forEach((col) => {
            if (!(col in xtabColsObj)){
                let ob = {}
                ob.key = col
                ob.name = col
                if (col == xtabIn.rowKey){
                    ob.idx = 1
                    ob.type = 'string'
                }else{
                    ob.idx = objIdx++
                    ob.type = 'number'
                }
                xtabColsObj[col] = ob
            }
        })
    })
    let xtabColsArr = Object.values(xtabColsObj)
    addWS(wb1, 'days', xtabColsArr, xtabRes);
    
    
    wb1.write('ExcelFile3.xlsx')
    




}

test1();