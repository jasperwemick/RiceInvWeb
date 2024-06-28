const BracketNode = (val, lev, par, buddy) => {

    return {
        value: val, 
        level: lev, 
        parent: par,
        left: null, 
        right: null,
        buddy: buddy
    }
}

export const GenerateBracketTree = (type, numPlayers, format) => {

    // format === 'full'
    let numUpperSets = numPlayers - 1 
    let numLowerSets = (type === 'Double') ? ((numPlayers - 1)) : 0

    if (format === 'split') {
        numUpperSets = Math.ceil(numPlayers / 2) - 1
    }

    const numSets = numUpperSets + numLowerSets

    const nearestPowerOf2 = (n) => {
        return 1 << 31 - Math.clz32(n);
    }

    const insertNode = (temp, key, fullBound, tech, data) => {

        let q = [];
        q.push(temp);

        while (q.length > 0) {

            temp = q.shift();

            if (temp.left == null) {
                
                temp.left = BracketNode(key, temp.level + 1, temp, data ? data.shift() : null);
                
                break;
            } else {
                // Look through the level of temp to find other tree sibling which lack a left child to maintain balance
                if (q.find(({ level, left }) => level === temp.level && left === null)) {
                    // The idea here is to shuffle the queue forwards until reaching a midpoint in the bracket level to achieve balance
                    const levels = q.filter(({ level }) => level === temp.level)
                    for (let i = 0; i < Math.floor(levels.length / 2); i++) {
                        q.push(q.shift());
                    }
                    q.push(temp)
                    continue
                }
                else {
                    q.push(temp.left);
                }
            }

            if ((tech === 'U' && temp.left.value >= fullBound) || (tech === 'L' && temp.level % 2 !== 0)) {
                continue;
            }
            else {
                if (temp.right == null) {
                    temp.right = BracketNode(key, temp.level + 1, temp, data ? data.shift() : null);
                    break;
                } else {
                    q.push(temp.right);
                }
            }
        }
    }

    const getOpenNodes = (temp) => {

        let openNodes = []

        if (temp) {
            var q = [];
    
            q.push(temp);
    
            while (q.length > 0) {
    
                temp = q.shift();
                if (temp.right !== null) {
                    q.push(temp.right);
                } 
                else {
                    openNodes.push(temp)
                }

                if (temp.left !== null) {
                    if (temp.left.value !== -1) {
                        q.push(temp.left);
                    }
                    else {
                        temp.left = null
                    }
                } 
                else {
                    temp.left = BracketNode(-1, -1, temp, null)
                    q.push(temp);
                }
            }
        }

        return openNodes
    }

    if (!numLowerSets) {

        var upperFinals = BracketNode(0, 0, null, null)
        
        for (let i = 1; i < numUpperSets; i++) {
            insertNode(upperFinals, i, nearestPowerOf2(numPlayers) - 1, 'U', null)
        }
        return upperFinals
    }
    else {

        var grandFinals = BracketNode(0, 0, null, null)

        grandFinals.right = BracketNode(numUpperSets + 2, 1, grandFinals, null) //Lower Final
        
        // Lower Bracket
        for (let i = numUpperSets + 3; i <= numSets; i++) {
            insertNode(grandFinals.right, i, nearestPowerOf2(numPlayers) * 2, 'L', null)
        }

        // Gets an ordered list of lower bracket set nodes that are open to upper bracket contenders to fall to
        let data = getOpenNodes(grandFinals.right)
        grandFinals.left = BracketNode(1, 2, grandFinals, data.shift())

        // Upper Bracket
        for (let i = 3; i <= numUpperSets + 1; i++) {
            insertNode(grandFinals.left, i, nearestPowerOf2(numPlayers), 'U', data)
        }

        // traverse(grandFinals)
        return grandFinals
    }
}

const traverse = (node) => {
    if (node) {
        console.log(`${node.value} : ${node.level}`)
        traverse(node.left)
        traverse(node.right)
    }
}

export const getMaxDepth = (node) => {
    if (node == null)
        return 0;
    else {
        const lDepth = getMaxDepth(node.left);
        const rDepth = getMaxDepth(node.right);
 
        if (lDepth > rDepth)
            return (lDepth + 1);
        else
            return (rDepth + 1);
    }
}

export const treeToArray = (node, maxDepth) => {

    let treeMap = Array(maxDepth + 1).fill().map(() => [].fill())

    if (node && maxDepth > 1) {
        var q = [];

        q.push(node);

        while (q.length > 0) {

            const temp = q.shift();

            if (temp.left !== null) {
                q.push(temp.left);
            } 
            if (temp.right !== null) {
                q.push(temp.right);
            }

            treeMap[temp.level].push(temp)
        }
    }

    return treeMap
}