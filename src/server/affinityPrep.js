

const affinityPrep = (data) => {
    const ctns = data.reduce((acc, ord) => {
        if (ord.carton in acc) {
            acc[ord.carton].push(ord.sku)
        } else {
            acc[ord.carton] = [ord.sku]
        }
        return acc
    }, [])
    const ctnList = Object.keys(ctns)
    // console.log(ctnList.length);
    //MAKE AFFINITY ARRAY
    let affAll = [];
    let noFriends = [];
    ctnList.forEach(o1 => {
        let foundOne = false
        const ord1 = ctns[o1]
        const affinity = ctnList.reduce((acc, ord) => {
            if (ord == o1) return acc
            const ord2 = ctns[ord]
            const intercection = ord1.filter(x => ord2.includes(x))
            const difference = ord1.filter(x => !ord2.includes(x)).concat(ord2.filter(x => !ord1.includes(x)));
            const iLen = intercection.length
            const dLen = difference.length
            if (iLen > 0) {
                foundOne = true
                const aff = iLen / (dLen + iLen)
                acc.push({ "ord1": o1, "ord2": ord, "aff": aff, "ord1Len": ord1.length, "ord2Len": ord2.length })
            }
            return acc
        }, [])
        if (foundOne == false) {
            // console.log('no friends' + o1);
            noFriends.push({ "ord1": o1, "ord2": undefined, "aff": 0, "ord1Len": ord1.length, "ord2Len": undefined })
        }
        affAll = affAll.concat(affinity)
    });
    affAll.sort((a, b) => b.aff - a.aff || b.ord1Len - a.ord1Len);

    // console.log(affAll);

    return {
        affAll,
        noFriends
    }
}

export default affinityPrep;