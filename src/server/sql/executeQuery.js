import connectToDatabase from './workWithSQL.js'
import _ from 'lodash'
// import cache from '../cache.js'
import { get } from './queries.js'


const executeQuery = async (action, tableName) => {
  const db = connectToDatabase();

  try {
    switch (action) {
      case 'getData':
        console.log(get);
        const records = await db.query(get.replace('TABLE_NAME_PLACEHOLDER', tableName));
        return records;
      case 'write':
        console.log(truncate.replace('TABLE_NAME_PLACEHOLDER', tableName));
        await db.query(truncate.replace('TABLE_NAME_PLACEHOLDER', tableName));
        console.log(`table truncated`);
        console.log(write.replace('TABLE_NAME_PLACEHOLDER', tableName));
        console.log(cache.dataForMySql);
        const dataChunked = _.chunk(cache.dataForMySql, 10);

        for (const chunk of dataChunked) {
          const items = chunk.map(item => [
            item.dte,
            item.sku,
            item.qty,
            item.rackNum,
            item.carton,
            item.grp
          ]);
          console.log(`Writing chunk of length ${items.length}:`);
          console.log(JSON.stringify(items))
          await db.query(write.replace('TABLE_NAME_PLACEHOLDER', tableName), [items]);
          console.log(`Chunk has been written`);
        }
        break;
    }
  } catch (error) {
    console.log(error);
  } finally {
    // await db.close();
  }
};

export const updateField = async (tableName, keyFieldName, updatingFieldName, items) => {

  const db = connectToDatabase();

  const sqlQueryPattern = 'UPDATE TABLE_NAME_PLACEHOLDER SET UPD_FIELD_PLACEHOLDER = ? WHERE KEY_FIELD_PLACEHOLDER = ?;'

  const query = sqlQueryPattern
    .replace('TABLE_NAME_PLACEHOLDER', tableName)
    .replace('UPD_FIELD_PLACEHOLDER', updatingFieldName)
    .replace('KEY_FIELD_PLACEHOLDER', keyFieldName);
  console.log(query);

  for (const itemKey in items) {
    const value = items[itemKey];
    await db.query(query, [value, itemKey]);

    console.log(`Updated rows with [${keyFieldName}]=${itemKey}. Field '${updatingFieldName}' was set to ${value}`)
  }

  console.log(`Finished updating table ${tableName}`);
}

export default executeQuery;
