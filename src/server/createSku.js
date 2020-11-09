import executeQuery from './sql/executeQuery.js'
import { updateField } from './sql/executeQuery.js'


const createSku = async () => {
    const table = 'asn';
    const data = await executeQuery('getAllData', table);
    console.log(data[0]);

    let skus = [];
    data.map((item) => {
        if (item.style !== '' && item.size !== '' && item.color !== '') {
            skus.push({
                id: item.id,
                sku: `${item.style}-${item.color}-${item.size}`
            });
        }
    });

    console.log(skus[0]);
    console.log(skus);

    await updateField(table, 'id', 'sku', skus);
}

createSku();


