import groupBy from '../../utils/groupBy.js'

const vasByDate = (data) => {
    const hasInspection = data.filter((item) => item.inspection === '1');
    let bys = ['wdate'];
    let sums = ['packedUnit'];
    let dcnts = ['carton'];
    const grouppedByInspection = groupBy(hasInspection, bys, sums, dcnts);

    const hasShoeTag = data.filter((item) => item.shoeTag === '1');
    const grouppedByShoeTag = groupBy(hasShoeTag, bys, sums, dcnts);

    console.log(grouppedByShoeTag[0]);

    const hasShoeBoxLabel = data.filter((item) => item.shoeBoxLabel === '1');
    const grouppedByShoeBoxLabel = groupBy(hasShoeBoxLabel, bys, sums, dcnts);

    const hasCartonLabel = data.filter((item) => item.cartonLabel === '1');
    const grouppedByCartonLabel = groupBy(hasCartonLabel, bys, sums, dcnts);

    const allData = [];

    grouppedByInspection.map((item) => {
        allData.push({
            wdate: item.wdate,
            unitsInspection: item.packedUnit_sum,
            cartonsInspection: item.carton_dcnt,
        })
    });

    grouppedByShoeTag.map((item) => {
        allData.push({
            wdate: item.wdate,
            unitsShoeTag: item.packedUnit_sum,
            cartonsShoeTag: item.carton_dcnt,
        })
    });

    grouppedByShoeBoxLabel.map((item) => {
        allData.push({
            wdate: item.wdate,
            unitsShoeBoxLabel: item.packedUnit_sum,
            cartonsShoeBoxLabel: item.carton_dcnt,
        })
    });

    grouppedByCartonLabel.map((item) => {
        allData.push({
            wdate: item.wdate,
            unitsCartonLabel: item.packedUnit_sum,
            cartonsCartonLabel: item.carton_dcnt,
        })
    });

    const allDates = allData.map((data) => data.wdate);
    const uniqueDates = [...new Set(allDates)];

    const uniqueDatesWithProperties = uniqueDates.map((date) => {
        return {
            date,
            unitsInspection: 0,
            cartonsInspection: 0,
            unitsShoeTag: 0,
            cartonsShoeTag: 0,
            unitsShoeBoxLabel: 0,
            cartonsShoeBoxLabel: 0,
            unitsCartonLabel: 0,
            cartonsCartonLabel: 0
        }
    })

    uniqueDatesWithProperties.sort((a, b) => parseInt(a.date) - parseInt(b.date));

    uniqueDatesWithProperties.map((date) => {
        allData.map((data) => {
            if (data.wdate === date.date) {
                const keys = Object.keys(data);
                keys.map((key) => {
                    if (key != 'wdate') {
                        date[key] += data[key];
                    }
                })
            }
        })
    });
    return uniqueDatesWithProperties;
}

export default vasByDate;