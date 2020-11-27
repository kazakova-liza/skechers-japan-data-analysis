import groupBy from '../../utils/groupBy.js'

const vasByDate = (data) => {
    const vasCustomers = data.filter((item) => {
        return (item.inspection === '1' || item.shoeTag === '1'
            || item.shoeBoxLabel === '1' || item.cartonLabel === '1');
    });

    const vasCustomersSummary = groupBy(vasCustomers, ['scust', 'inspection', 'shoeTag', 'shoeBoxLabel', 'cartonLabel'], ['packedUnit'], []);

    const customers = vasCustomersSummary.map((item) => item.scust);
    const uniqueCustomers = [...new Set(customers)];

    const uniqueCustomersWithProperties = uniqueCustomers.map((cust) => {
        return {
            cust,
            unitsInspection: 0,
            cartonsInspection: 0,
            unitsShoeTag: 0,
            cartonsShoeTag: 0,
            unitsShoeBoxLabel: 0,
            cartonsShoeBoxLabel: 0,
            unitsCartonLabel: 0,
            cartonsCartonLabel: 0
        }
    })

    uniqueCustomersWithProperties.map((customer) => {
        vasCustomersSummary.map((cust) => {
            console.log(cust);
            if (cust.scust === customer.cust) {
                if (cust.inspection === '1') {
                    customer.unitsInspection = cust.packedUnit_sum;
                    customer.cartonsInspection = cust.cnt;
                }
                if (cust.shoeTag === '1') {
                    customer.unitsShoeTag = cust.packedUnit_sum;
                    customer.cartonsShoeTag = cust.cnt;
                }
                if (cust.shoeBoxLabel === '1') {
                    customer.unitsShoeBoxLabel = cust.packedUnit_sum;
                    customer.cartonsShoeBoxLabel = cust.cnt;
                }
                if (cust.cartonLabel === '1') {
                    customer.unitsCartonLabel = cust.packedUnit_sum;
                    customer.cartonsCartonLabel = cust.cnt;
                }
            }

        })
    });
    return uniqueCustomersWithProperties;
}

export default vasByDate;