import _ from 'lodash'

const makeFriends = (noFriends, groupNumber) => {
    const groupSize = 20;
    const noFriendsChunked = _.chunk(noFriends, groupSize);
    const noFriendsGroups = noFriendsChunked.reduce((acc, chunk) => {
        groupNumber++;
        chunk.map((carton) => {
            acc = {
                ...acc,
                [carton.ord1]: groupNumber
            }
        })
        return acc;
    }, {})
    return {
        noFriendsGroups,
        groupNumber
    }
}

export default makeFriends;