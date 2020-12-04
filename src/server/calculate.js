const calculate = (data) => {
    const keys = Object.keys(data[0]);
    const integers = keys.filter(key => typeof data[0][key] === 'number' && key != 'id');
    console.log(integers);
    const result = integers.map((integer) => {
        let calculations = {};
        const values = data.map((item) => item[integer]);
        console.log(values.length);
        const uniqueValues = [...new Set(values)];
        console.log(uniqueValues.length);
        const min = Math.min(...uniqueValues);
        const max = Math.max(...uniqueValues);
        const sum = values.reduce((acc, value) => acc += value, 0);
        const count = values.length;
        const avg = sum / count;
        calculations[`${integer}_min`] = min;
        calculations[`${integer}_max`] = max;
        calculations[`${integer}_avg`] = avg;
        calculations[`${integer}_total`] = sum;
        return calculations;
    })
    console.log(result);
    return result;
}

export default calculate;