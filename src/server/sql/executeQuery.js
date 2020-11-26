import connectToDatabase from './workWithSQL.js'
import _ from 'lodash'
import { get, write, truncateTable } from './queries.js'


const executeQuery = async (action, name = undefined, query = undefined, data = undefined, fields = undefined, truncate = false) => {
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
        if (truncate === true) {
          console.log(truncateTable.replace('TABLE_NAME_PLACEHOLDER', name));
          await db.query(truncateTable.replace('TABLE_NAME_PLACEHOLDER', name));
          console.log(`table truncated`);
        }
        const dataChunked = _.chunk(data, 10000);
        const query1 = write.replace('TABLE_NAME_PLACEHOLDER', name)
          .replace('FIELDS_NAMES_PLACEHOLDER', fields);
        console.log(query1);

        for (let chunk of dataChunked) {
          await db.query(query1, [chunk]);
          console.log(`Chunk has been written`);
          chunk = null;
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
    await db.query(query, [item[updatingFieldName], item[keyFieldName]]);

    // console.log(`Updated rows with [${keyFieldName}]=${item.id}. Field '${updatingFieldName}' was set to ${item.sku}`)
  }

  console.log(`Finished updating table ${tableName}`);
}

export default executeQuery;
