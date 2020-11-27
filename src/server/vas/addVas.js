import { executeQuery, updateField } from "../sql/executeQuery.js";

const addVasType = async () => {
    const query = `SELECT soldTo, id
                    from japan2.orders`;
    const data = await executeQuery('getSpecificData', undefined, query);
    const inspection = ['10036'];
    const shoeTag = ['10005', '10015', '10038', '10036', '10007', '10057'];
    const shoeBoxLabel = ['10005', '10015', '10047', '10004', '10036'];
    const cartonLabel = ['10005', '10015', '10047', '10036', '10039', '10008', '10007', '10032', '10006', '10018'];

    data.map((item) => {
        item.inspection = false;
        item.shoeTag = false;
        item.shoeBoxLabel = false;
        item.cartonLabel = false;

        if (inspection.includes(item.soldTo)) {
            item.inspection = true;
        }
        if (shoeTag.includes(item.soldTo)) {
            item.shoeTag = true;
        }
        if (shoeBoxLabel.includes(item.soldTo)) {
            item.shoeBoxLabel = true;
        }
        if (cartonLabel.includes(item.soldTo)) {
            item.cartonLabel = true;
        }
    })
    console.log(data[0]);


    // await updateField('orders', 'id', 'inspection', data);
    // await updateField('orders', 'id', 'shoeTag', data);
    // await updateField('orders', 'id', 'shoeBoxLabel', data);
    await updateField('orders', 'id', 'cartonLabel', data);
}

addVasType();

export default addVasType;




