import executeQuery from './sql/executeQuery.js'
import { updateField } from './sql/executeQuery.js'


const createVasType = async () => {
    const table = 'orders';

    const data = await executeQuery('getAllData', table);
    console.log(data[0]);

    const itemVAS = ['10003', '10004', '10005', '10006', '10007', '10018', '10032', '10036',
        '10037', '10038', '10040', '10041', '10047', '10057', '10059', '10063',
        '10072', '10082', '10083', '10005', '10015', '10047'];
    const cartonVAS = ['10003', '10005', '10008', '10009', '10010', '10011',
        '10015', '10018', '10032', '10036', '10038', '10039', '10041', '10047',
        '10054', '10063', '10074', '10080', '10005', '10015', '10047'];

    let vasCodes = [];

    data.map((item) => {
        let vas;
        if (itemVAS.includes(item.soldTo) && !cartonVAS.includes(item.soldTo)) {
            vas = 'item';
        }
        if (!itemVAS.includes(item.soldTo) && cartonVAS.includes(item.soldTo)) {
            vas = 'carton';
        }
        if (itemVAS.includes(item.soldTo) && cartonVAS.includes(item.soldTo)) {
            vas = 'both';
        }
        if (!itemVAS.includes(item.soldTo) && !cartonVAS.includes(item.soldTo)) {
            vas = 'none';
        }
        vasCodes.push({
            id: item.id,
            vas
        })
    })

    await updateField(table, 'id', 'vas', vasCodes);
    console.log(`vas types added to table ${table}`);
}

createVasType();




