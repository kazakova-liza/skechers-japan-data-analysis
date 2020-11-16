import executeQuery from './sql/executeQuery.js'
import { updateField } from './sql/executeQuery.js'


const createSku = async () => {
    const table = 'crt';
    const data = await executeQuery('getAllData', table);
    // console.log(data[0]);

    let skus = [];
    data.map((item) => {
        if (item.style !== '' && item.size !== '' && item.color !== '') {
            skus.push({
                id: item.id,
                sku: `${item.style}-${item.color}-${item.size}`
            });
        }
    });

    // console.log(skus[0]);
    // console.log(skus);

    await updateField(table, 'id', 'sku', skus);
    // console.log(`skus added to table ${table}`);
}

createSku();


