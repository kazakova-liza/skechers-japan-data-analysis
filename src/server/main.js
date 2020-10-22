import executeQuery from './sql/executeQuery.js'
import { updateField } from './sql/executeQuery.js'

const getUnique = (array) => {
    let flags = [], output = [];
    for (let i = 0; i < array.length; i++) {
        if (flags[array[i]]) {
            continue;
        }
        flags[array[i]] = true;
        output.push(array[i]);
    }
    return output;
}

const main = async () => {
    const data = await executeQuery('getData', 'EX20ASN');
    console.log(data[0]);
    console.log(`Total number of rows: ${data.length}`)

    const groups = data.map((item) => item.productGroup);
    console.log(`Groups count: ${groups.length}`);
    const uniqueGroups = getUnique(groups);
    console.log(uniqueGroups);
    console.log(`Unique groups count: ${uniqueGroups.length}`);

    let avg = [];
    for (const group of uniqueGroups) {
        let handledLength = [];
        let distinctLengthsCount = 0;
        let totalSoldForGroupCaseLength = 0;
        let totalSoldForGroupCaseLengthMultipliedByLength = 0;
        for (const item of data) {
            if (item.productGroup == group) {
                const len = item.caseLength;
                if (handledLength[len]) {
                    continue;
                }
                handledLength[len] = true;
                totalSoldForGroupCaseLength += parseInt(item.soldForGroupCaseLength);
                totalSoldForGroupCaseLengthMultipliedByLength +=
                    parseInt(item.soldForGroupCaseLength) * parseInt(len);
                distinctLengthsCount++;
            }
        }
        const avgLength = totalSoldForGroupCaseLengthMultipliedByLength / totalSoldForGroupCaseLength;
        console.log(`[${group}] 
        totalSoldForGroupCaseLengthMultipliedByLength=${totalSoldForGroupCaseLengthMultipliedByLength} 
        totalSoldForGroupCaseLength=${totalSoldForGroupCaseLength} 
        distinctLengthsCount=${distinctLengthsCount} 
        avgLength=${avgLength}`)

        avg[group] = Math.round(avgLength * 100) / 100; // Round to two decimals
    }
    console.log(avg);

    await updateField('EX20ASN', 'productGroup', 'avgCaseLength', avg);
}

main();



