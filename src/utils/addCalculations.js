import calculate from './calculate.js'

const addCalculations = (ws, columns, data) => {
    const calculations = calculate(data);
    const dataLength = data.length;

    ws.cell(dataLength + 2, 1).string('min');
    ws.cell(dataLength + 3, 1).string('max');
    ws.cell(dataLength + 4, 1).string('avg');
    ws.cell(dataLength + 5, 1).string('total');

    calculations.map((calc) => {
        // console.log(calc);
        const keys = Object.keys(calc);
        let columnName;
        // console.log(keys[0].split('_'));
        if (keys[0].split('_').length === 2) {
            columnName = keys[0].split('_')[0];
        }
        else {
            columnName = `${keys[0].split('_')[0]}_${keys[0].split('_')[1]}`;
        }
        const column = columns.find((col) => col.name === columnName);
        if (column != undefined) {
            const index = column.idx;
            keys.map((key) => {
                const splitKey = key.split('_');
                let counter;
                let i;
                if (splitKey.length === 2) {
                    i = 1;
                }
                else {
                    i = 2;
                }
                if (splitKey[i] === 'min') {
                    counter = 2;
                }
                if (splitKey[i] === 'max') {
                    counter = 3;
                }
                if (splitKey[i] === 'avg') {
                    counter = 4;
                }
                if (splitKey[i] === 'total') {
                    counter = 5;
                }
                ws.cell(dataLength + counter, index).number(calc[key]);
            })
        }

    })
}

export default addCalculations;