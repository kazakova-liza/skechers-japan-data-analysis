import connectToDatabase from './workWithSQL.js'
import _ from 'lodash'
import { get } from './queries.js'


const executeQuery = async (action, name, query) => {
  const db = connectToDatabase();
  let records;

  try {
    switch (action) {
      case 'getSpecificData':
        console.log(query);
        records = await db.query(query.replace('TABLE_NAME_PLACEHOLDER', name));
        return records;
      case 'getSQL':
        const sql = await db.query(name);
        return sql;
      case 'getAllData':
        console.log(get);
        records = await db.query(get.replace('TABLE_NAME_PLACEHOLDER', name));
        return records;
      case 'write':
        console.log(truncate.replace('TABLE_NAME_PLACEHOLDER', name));
        await db.query(truncate.replace('TABLE_NAME_PLACEHOLDER', name));
        console.log(`table truncated`);
        console.log(write.replace('TABLE_NAME_PLACEHOLDER', name));
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
          await db.query(write.replace('TABLE_NAME_PLACEHOLDER', name), [items]);
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

  const database = 'japan2';

  const sqlQueryPattern = `UPDATE ${database}.TABLE_NAME_PLACEHOLDER SET UPD_FIELD_PLACEHOLDER = ? WHERE KEY_FIELD_PLACEHOLDER = ?;`

  const query = sqlQueryPattern
    .replace('TABLE_NAME_PLACEHOLDER', tableName)
    .replace('UPD_FIELD_PLACEHOLDER', updatingFieldName)
    .replace('KEY_FIELD_PLACEHOLDER', keyFieldName);
  console.log(query);

  for (const item of items) {
    await db.query(query, [item.sku, item.id]);

    console.log(`Updated rows with [${keyFieldName}]=${item.id}. Field '${updatingFieldName}' was set to ${item.sku}`)
  }

  console.log(`Finished updating table ${tableName}`);
}

export default executeQuery;
