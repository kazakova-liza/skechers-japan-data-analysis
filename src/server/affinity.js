import affinityPrep from './affinityPrep.js'
import affinityGroup from './affinityGroup.js'
import groupBy from '../utils/groupBy.js'
import executeQuery from './sql/executeQuery.js'
import xl from 'excel4node'
import addWS from '../utils/addWS.js'

const createAffinity = async () => {
    const query = `SELECT carton, packedUnit, sku, left(wave, 8) as wdate, left(customer, 9) as cust
                        FROM japan2.orders where left(wave, 8) = '20200324' and cartonType = 'active'`;

    const allOrds = await executeQuery('getSpecificData', undefined, query);

    let bys = ['cust'];
    let sums = ['packedUnit'];
    let dcnts = [];

    const ordsGrouppedByCust = groupBy(allOrds, bys, sums, dcnts);

    const bigCustomers = ordsGrouppedByCust.filter((cust) => cust.packedUnit_sum >= 1000);
    const bigCustomersNames = bigCustomers.map((cust) => cust.cust);

    console.log(bigCustomersNames);


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
    const smallCustData = affinityGroup(smallCustAff, groupNumber);
    const smallCustGroups = smallCustData.allGroups;
    // const smallGroups = Object.keys(smallCustGroups);
    // smallGroups.map((group) => {
    //     smallCustGroups[group] = {
    //         groupNumber: smallCustGroups[group],
    //         customer: 'small'
    //     }
    // })
    let allGroups = { ...smallCustGroups };

    groupNumber = smallCustGroups.groupNumber;

    bigCustomersOrders.map((cust) => {
        const custAff = affinityPrep(cust.orders);
        const custData = affinityGroup(custAff, groupNumber);
        console.log(cust.orders.length);

        const custGroups = custData.allGroups;
        // const custGroupsKeys = Object.keys(custGroups);
        // custGroupsKeys.map((group) => {
        //     custGroups[group] = {
        //         groupNumber: custGroups[group],
        //         customer: cust.customer
        //     }
        // })
        groupNumber = custData.groupNumber;
        allGroups = { ...allGroups, ...custGroups };
    })

    // console.log(allGroups);

    const ords2 = allOrds.map(ln => {
        if (allGroups[ln.carton] === undefined) {
            console.log(ln.carton)
        }
        ln.putGrp = allGroups[ln.carton];
        return ln
    })

    // console.log(ords2);
    const smallCustomersOrds = ords2.filter((order) => !bigCustomersNames.includes(order.cust));
    const bigCustomerOrds = ords2.filter((order) => bigCustomersNames.includes(order.cust));
    // const bigCustomerOrdsGroupped = groupBy


    ords2.sort((a, b) => { return a.sku.localeCompare(b.sku) || a.putGrp - b.putGrp });
    const affResAll = groupBy(ords2, ['putGrp'], ['packedUnit'], ['carton', 'sku'])


    // console.log(affResAll[0])
    // need to display average line, skus, cartons per group from affRes

    const workBook = new xl.Workbook();
    const columns = [
        { key: "putGrp", name: "putGrp", idx: 1, type: "number" },
        { key: "cnt", name: "cnt", idx: 2, type: "number" },
        { key: "packedUnit_sum", name: "packedUnit_sum", idx: 3, type: "number" },
        { key: "carton_dcnt", name: "carton_dcnt", idx: 4, type: "number" },
        { key: "sku_dcnt", name: "sku_dcnt", idx: 5, type: "number" },
    ]
    addWS(workBook, 'affAll', columns, affResAll);
    workBook.write(`affinity.xlsx`);

    var statsAll = affResAll.reduce((stats, grp) => {
        stats.grps++
        stats.skus += grp.sku_dcnt
        stats.ctns += grp.carton_dcnt
        stats.qty += grp.packedUnit_sum
        stats.lines += grp.cnt
        return stats
    }, { "grps": 0, "skus": 0, "ctns": 0, "qty": 0, "lines": 0 });

    const smallCustRes = groupBy(smallCustomersOrds, ['putGrp'], ['packedUnit'], ['carton', 'sku']);

    addWS(workBook, 'affSmall', columns, smallCustRes);
    workBook.write(`affinity.xlsx`);

    var statsSmall = smallCustRes.reduce((stats, grp) => {
        stats.grps++
        stats.skus += grp.sku_dcnt
        stats.ctns += grp.carton_dcnt
        stats.qty += grp.packedUnit_sum
        stats.lines += grp.cnt
        return stats
    }, { "grps": 0, "skus": 0, "ctns": 0, "qty": 0, "lines": 0 });




}

createAffinity();