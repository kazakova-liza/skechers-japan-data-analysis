import getVolBandStatistics from './volBands.js'
import createDailyReceivingStats from './receivings.js'
import createReturnsStatistics from './returns.js'
import createShipmentsStatistics from './shipments.js'
import xl from 'excel4node'
import addWS from '../../utils/addWS.js'
import createColumnsArray from '../createColumnsArray.js'
import addCalculations from '../addCalculations.js'

const calculateReceivingStats = async () => {
    const dailyReceving = await createDailyReceivingStats();
    const dailyReturns = await createReturnsStatistics();
    const volBands = await getVolBandStatistics();

    const shipments = await createShipmentsStatistics();



    const wb1 = new xl.Workbook();

    const dailyRecevingColumns = createColumnsArray(dailyReceving.greaterThan100Cases[0]);

    const ws = wb1.addWorksheet('dailyReceiving >= 100');
    addWS(ws, dailyRecevingColumns, dailyReceving.greaterThan100Cases);
    addCalculations(ws, dailyRecevingColumns, dailyReceving.greaterThan100Cases);

    const ws1 = wb1.addWorksheet('dailyReceiving < 100');
    addWS(ws1, dailyRecevingColumns, dailyReceving.lessThan100Cases);
    addCalculations(ws1, dailyRecevingColumns, dailyReceving.lessThan100Cases);


    const volBandsColumns = createColumnsArray(volBands.greaterThan100Cases[0]);

    const ws2 = wb1.addWorksheet('volBands >= 100');
    addWS(ws2, volBandsColumns, volBands.greaterThan100Cases);
    addCalculations(ws2, volBandsColumns, volBands.greaterThan100Cases);

    const ws3 = wb1.addWorksheet('volBands < 100');
    addWS(ws3, volBandsColumns, volBands.lessThan100Cases);
    addCalculations(ws3, volBandsColumns, volBands.lessThan100Cases);


    const returnsColumns = createColumnsArray(dailyReturns[0]);

    const ws4 = wb1.addWorksheet('returns');
    addWS(ws4, returnsColumns, dailyReturns);
    addCalculations(ws4, returnsColumns, dailyReturns);


    const shipmentsColumns = createColumnsArray(shipments[0]);
    const ws5 = wb1.addWorksheet('shipments');
    addWS(ws5, shipmentsColumns, shipments);
    addCalculations(ws5, shipmentsColumns, shipments);

    wb1.write(`japan_receiving.xlsx`);
    console.log('statistics has been written to a spreadsheet');
}

calculateReceivingStats();