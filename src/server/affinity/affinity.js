import affinityPrep from './affinityPrep.js'
import affinityGroup from './affinityGroup.js'
import groupBy from '../../utils/groupBy.js'
import executeQuery from '../sql/executeQuery.js'
import makeFriends from './makeFriends.js'
import xl from 'excel4node'
import addWS from '../../utils/addWS.js'

const createAffinity = async () => {
    const query = `SELECT carton, packedUnit, sku, left(wave, 8) as wdate, left(customer, 9) as cust
                        FROM japan2.orders where left(wave, 8) = '20200324' and cartonType = 'active' and packedUnit > 0`;

    const allOrds = await executeQuery('getSpecificData', undefined, query);

    let bys = ['cust'];
    let sums = ['packedUnit'];
    let dcnts = [];

    const ordsGrouppedByCust = groupBy(allOrds, bys, sums, dcnts);

    const bigCustomers = ordsGrouppedByCust.filter((cust) => cust.packedUnit_sum >= 1000);
    const bigCustomersNames = bigCustomers.map((cust) => cust.cust);
    const bigCustomersOrders = bigCustomers.map((cust) => {
        const custOrders = allOrds.filter((order) => order.cust === cust.cust);
        return {
            customer: cust.cust,
            orders: custOrders
        }
    })

    const smallCustomers = ordsGrouppedByCust.filter((cust) => cust.packedUnit_sum < 1000);
    let smallCustomersOrders = smallCustomers.map((cust) => {
        const custOrders = allOrds.filter((order) => order.cust === cust.cust)
        return custOrders;
    })
    smallCustomersOrders = smallCustomersOrders.flat();

    let groupNumber = 0;

    const smallCustAff = affinityPrep(smallCustomersOrders);
    const smallCustGroups = affinityGroup(smallCustAff.affAll, groupNumber);
    const ords1 = smallCustAff.affAll.map((item) => item.ord1);
    const uniqueOrds1 = new Set(ords1);
    const uniqueOrds1Length = uniqueOrds1.length;
    groupNumber = smallCustGroups.groupNumber;
    console.log(`small cust groups: ${Object.keys(smallCustGroups.allGroups).length}`);
    const smallCustNoFriendsGroups = makeFriends(smallCustAff.noFriends, groupNumber);

    let allGroups = { ...smallCustGroups.allGroups, ...smallCustNoFriendsGroups.noFriendsGroups };

    console.log(`small: ${Object.keys(allGroups).length}`);

    groupNumber = smallCustNoFriendsGroups.groupNumber;

    bigCustomersOrders.map((cust) => {
        const custAff = affinityPrep(cust.orders);
        const custGroups = affinityGroup(custAff.affAll, groupNumber);
        groupNumber = custGroups.groupNumber;
        const friendsGroup = makeFriends(custAff.noFriends, groupNumber);
        allGroups = { ...allGroups, ...custGroups.allGroups, ...friendsGroup.noFriendsGroups };
        console.log(`big: ${Object.keys(allGroups).length}`);
    })

    console.log(`all: ${Object.keys(allGroups).length}`);


    const ords2 = allOrds.map(ln => {
        if (allGroups[ln.carton] === undefined) {
            console.log(ln.carton)
        }
        ln.putGrp = allGroups[ln.carton];
        return ln
    })

    const smallCustomersOrds = ords2.filter((order) => !bigCustomersNames.includes(order.cust));
    const bigCustomerOrds = ords2.filter((order) => bigCustomersNames.includes(order.cust));

    ords2.sort((a, b) => { return a.sku.localeCompare(b.sku) || a.putGrp - b.putGrp });
    let config = {
        bys: ['putGrp'],
        sums: ['packedUnit'],
        dcnts: ['carton', 'sku']
    }
    const affResAll = groupBy(ords2, config)
    const affResAllFiltered = affResAll.filter((res) => res.putGrp != 'null');

    // need to display average line, skus, cartons per group from affRes

    const workBook = new xl.Workbook();
    const columns = [
        { key: "putGrp", name: "putGrp", idx: 1, type: "number" },
        { key: "cnt", name: "cnt", idx: 2, type: "number" },
        { key: "packedUnit_sum", name: "packedUnit_sum", idx: 3, type: "number" },
        { key: "carton_dcnt", name: "carton_dcnt", idx: 4, type: "number" },
        { key: "sku_dcnt", name: "sku_dcnt", idx: 5, type: "number" },
    ]
    addWS(workBook, 'affAll', columns, affResAllFiltered);
    workBook.write(`affinity.xlsx`);

    var statsAll = affResAllFiltered.reduce((stats, grp) => {
        stats.grps++
        stats.skus += grp.sku_dcnt
        stats.ctns += grp.carton_dcnt
        stats.qty += grp.packedUnit_sum
        stats.lines += grp.cnt
        return stats
    }, { "grps": 0, "skus": 0, "ctns": 0, "qty": 0, "lines": 0 });

    const columnsTotal =
        [
            { key: "grps", name: "grps", idx: 1, type: "number" },
            { key: "skus", name: "skus", idx: 2, type: "number" },
            { key: "ctns", name: "ctns", idx: 3, type: "number" },
            { key: "qty", name: "qty", idx: 4, type: "number" },
            { key: "lines", name: "lines", idx: 5, type: "number" },
        ];

    addWS(workBook, 'affAll_stats', columnsTotal, [statsAll]);
    workBook.write(`affinity.xlsx`);

    const smallCustRes = groupBy(smallCustomersOrds, config);
    const smallCustResFiltered = smallCustRes.filter((res) => res.putGrp != 'null');

    addWS(workBook, 'affSmall', columns, smallCustResFiltered);
    workBook.write(`affinity.xlsx`);

    var statsSmall = smallCustRes.reduce((stats, grp) => {
        stats.grps++
        stats.skus += grp.sku_dcnt
        stats.ctns += grp.carton_dcnt
        stats.qty += grp.packedUnit_sum
        stats.lines += grp.cnt
        return stats
    }, { "grps": 0, "skus": 0, "ctns": 0, "qty": 0, "lines": 0 });

    addWS(workBook, 'affSmall_stats', columnsTotal, [statsSmall]);
    workBook.write(`affinity.xlsx`);

    bigCustomersNames.map((cust) => {
        const ords = bigCustomerOrds.filter((order) => order.cust);
        const affRes = groupBy(ords, config);
        const affResFiltered = affRes.filter((res) => res.putGrp != 'null');

        addWS(workBook, cust, columns, affResFiltered);
        workBook.write(`affinity.xlsx`);

        var stats = affRes.reduce((stats, grp) => {
            stats.grps++
            stats.skus += grp.sku_dcnt
            stats.ctns += grp.carton_dcnt
            stats.qty += grp.packedUnit_sum
            stats.lines += grp.cnt
            return stats
        }, { "grps": 0, "skus": 0, "ctns": 0, "qty": 0, "lines": 0 });

        addWS(workBook, `${cust}_stats`, columnsTotal, [stats]);
        workBook.write(`affinity.xlsx`);

    })

}

createAffinity();