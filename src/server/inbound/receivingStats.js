import getVolBandStatistics from './volBands.js'
import createDailyReceivingStats from './receivings.js'
import createReturnsStatistics from './returns.js'
import createShipmentsStatistics from './shipments.js'
import xl from 'excel4node'
import addWS from '../../utils/addWS.js'

const calculateReceivingStats = async () => {
    const dailyReceving = await createDailyReceivingStats();
    const dailyReturns = await createReturnsStatistics();
    const volBands = await getVolBandStatistics();

    const shipments = await createShipmentsStatistics();



    const workBook = new xl.Workbook();

    const dailyRecevingColumns = [
        { key: "date", name: "Date", idx: 1, type: "objToString" },
        { key: "containers", name: "containers", idx: 2, type: "number" },
        { key: "palletsSum", name: "palletsSum", idx: 3, type: "number" },
        { key: "pallEquivSum", name: "pallEquivSum", idx: 4, type: "number" },
        { key: "casesSum", name: "casesSum", idx: 5, type: "number" },
        { key: "unitsSum", name: "unitsSum", idx: 6, type: "number" },
        { key: "dSkus", name: "dSkus", idx: 7, type: "number" },
        { key: "dStyles", name: "dStyles", idx: 8, type: "number" },
        { key: "abBandsPalletsSum", name: "abBandsPalletsSum", idx: 9, type: "number" },
        { key: "cdBandCasesSum", name: "cdBandCasesSum", idx: 10, type: "number" },
    ]
    addWS(workBook, 'dailyReceiving >= 100', dailyRecevingColumns, dailyReceving.greaterThan100Cases);
    workBook.write(`receiving.xlsx`);

    addWS(workBook, 'dailyReceiving < 100', dailyRecevingColumns, dailyReceving.lessThan100Cases);
    workBook.write(`receiving.xlsx`);

    const volBandsColumns = [
        { key: "volBand", name: "volBand", idx: 1, type: "string" },
        { key: "COUNT(*)", name: "count", idx: 2, type: "number" },
        { key: "SUM(units)", name: "unitsSum", idx: 3, type: "number" },
        { key: "sumCases", name: "casesSum", idx: 4, type: "number" },
        { key: "SUM(pallets)", name: "palletsSum", idx: 5, type: "number" },
        { key: "SUM(pallequiv)", name: "pallEquivSum", idx: 6, type: "number" },
        { key: "count(distinct sku)", name: "skus", idx: 7, type: "number" },
        { key: "shipments", name: "shipments", idx: 8, type: "number" },
    ];

    addWS(workBook, 'volBands >= 100', volBandsColumns, volBands.greaterThan100Cases);
    workBook.write(`receiving.xlsx`);

    addWS(workBook, 'volBands < 100', volBandsColumns, volBands.lessThan100Cases);
    workBook.write(`receiving.xlsx`);

    const returnsColumns = [
        { key: "verifiedDate", name: "Date", idx: 1, type: "objToString" },
        { key: "unitsVerified_sum", name: "unitsSum", idx: 2, type: "number" },
        { key: "sku_dcnt", name: "dSkus", idx: 3, type: "number" },
    ];

    addWS(workBook, 'returns', returnsColumns, dailyReturns);
    workBook.write(`receiving.xlsx`);

    const shipmentsColumns = [
        { key: "shipment", name: "shipment", idx: 1, type: "string" },
        { key: "cases_sum", name: "cases", idx: 2, type: "number" },
        { key: "units_sum", name: "units", idx: 3, type: "number" },
        { key: "sku_dcnt", name: "dSkus", idx: 4, type: "number" },
        { key: "style_dcnt", name: "dStyles", idx: 5, type: "number" },
        { key: "abBandsPalletsSum", name: "abBandsPalletsSum", idx: 6, type: "number" },
        { key: "cdBandCasesSum", name: "cdBandCasesSum", idx: 7, type: "number" },
    ]
    addWS(workBook, 'shipments', shipmentsColumns, shipments);
    workBook.write(`receiving.xlsx`);
    console.log('statistics has been written to a spreadsheet');
}

calculateReceivingStats();