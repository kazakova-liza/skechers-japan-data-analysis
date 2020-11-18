


const createCrossTab = (data, xtabIn) => {
    let xtab = {}

    data.forEach(element => {
        if (!(element[xtabIn.rowKey] in xtab)) {
            xtab[element[xtabIn.rowKey]] = {}
        }
        if (!(element[xtabIn.colKey] in xtab[element[xtabIn.rowKey]])) {
            xtab[element[xtabIn.rowKey]][element[xtabIn.colKey]] = 0
        }
        xtab[element[xtabIn.rowKey]][element[xtabIn.colKey]] += element[xtabIn.sum]
    })
    let res = []
    let xtabColsObj = {}
    let objIdx = 2
    Object.keys(xtab).forEach((row) => {
        xtab[row][xtabIn.rowKey] = row
        res.push(xtab[row])
        Object.keys(xtab[row]).forEach((col) => {
            if (!(col in xtabColsObj)) {
                let ob = {}
                ob.key = col
                ob.name = col
                if (col == xtabIn.rowKey) {
                    ob.idx = 1
                    ob.type = 'string'
                } else {
                    ob.idx = objIdx++
                    ob.type = 'number'
                }
                xtabColsObj[col] = ob
            }
        })
    })
    let colsArr = Object.values(xtabColsObj)
    return {
        colsArr,
        res
    }
}

export default createCrossTab;