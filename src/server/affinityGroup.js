
const affinityGroup = (affAll, grpNum = 0) => {
    const groupSize = 20;
    const allGrps = {}
    //for(let grpNum = 0; grpNum < 500; grpNum++){
    while (affAll.length > 0) {
        grpNum += 1
        let grpList = [affAll[0].ord1]
        let affThreshold = 1
        for (let x = 0; x < 250; x++) {
            let candidate = affAll.filter(checkAff => {
                const aa = grpList.includes(checkAff.ord1)
                const bb = checkAff.aff >= affThreshold
                const cc = grpList.includes(checkAff.ord2)
                return aa && bb && !cc
            })
            if (candidate.length == 0) {
                affThreshold = affThreshold / 1.5
                if (affThreshold < 0.05) {
                    candidate = [affAll.find(checkAff => !(grpList.includes(checkAff.ord1)))]
                    if (candidate[0] == undefined) candidate = []
                    affThreshold = 1
                }
            }
            grpList = grpList.concat(candidate.map(a => a.ord2))
            grpList = Array.from(new Set(grpList))
            if (grpList.length > groupSize) break
            //console.log(grpList.length, affAll.length)
        }
        if (grpList.length < groupSize) {
            console.log('short')
        }
        grpList = grpList.slice(0, groupSize)
        grpList.forEach(ctn => {
            allGrps[ctn] = grpNum
        })
        //REMOVE USED CARTONS FROM AFFINITY ARRAY
        affAll = affAll.filter(checkAff => {
            const aa = grpList.includes(checkAff.ord1)
            const bb = grpList.includes(checkAff.ord2)
            return !(aa || bb)
        })
         console.log(grpNum, grpList.length, affAll.length)
    }

    console.log(Object.values(allGrps).length);

    return {
        allGroups: allGrps,
        groupNumber: grpNum
    }
}

export default affinityGroup;