interface BracketNode {
    value : number;
    level : number;
    parent : BracketNode | null;
    left : BracketNode | null;
    right : BracketNode | null;
    buddy : BracketNode | null;
}

function CreateBracketNode(val : number, lev : number, par : BracketNode | null, buddy : BracketNode | null): BracketNode {
    return {
        value: val, 
        level: lev, 
        parent: par,
        left: null, 
        right: null,
        buddy: buddy
    }
}

export function GenerateBracketTree(type : string, numPlayers : number, format : string) {
    // format === 'full'
    let numUpperSets = numPlayers - 1 
    let numLowerSets = (type === 'Double') ? ((numPlayers - 1)) : 0

    if (format === 'split') {
        numUpperSets = Math.ceil(numPlayers / 2) - 1
    }

    const numSets = numUpperSets + numLowerSets

    const nearestPowerOf2 = (n : number) => {
        return 1 << 31 - Math.clz32(n);
    }

    const insertNode = (temp : BracketNode, key : number, fullBound : number, tech : string, data : BracketNode[]) => {

        let q : BracketNode[] = [];
        q.push(temp);

        while (q.length > 0) {

            let front : BracketNode | undefined = q.shift();
            if (!front) { break; }
            temp = front

            if (temp.left == null) {
                let newBuddy : BracketNode | undefined = data.shift()
                temp.left = CreateBracketNode(key, temp.level + 1, temp, newBuddy ? newBuddy : null);
                break;

            } else {
                // Look through the level of temp to find other tree sibling which lack a left child to maintain balance
                if (q.find(({ level, left }) => level === temp.level && left === null)) {
                    // The idea here is to shuffle the queue forwards until reaching a midpoint in the bracket level to achieve balance
                    const levels = q.filter(({ level }) => level === temp.level)
                    for (let i = 0; i < Math.floor(levels.length / 2); i++) {
                        let pushItem : BracketNode | undefined = q.shift();
                        if (!pushItem) { break; }
                        q.push(pushItem);
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
                    let newBuddy : BracketNode | undefined = data.shift()
                    temp.right = CreateBracketNode(key, temp.level + 1, temp, newBuddy ? newBuddy : null);
                    break;
                } else {
                    q.push(temp.right);
                }
            }
        }
    }

    const getOpenNodes = (temp : BracketNode) => {

        // THIS DOES NOT WORK IF BRACKET DEPTH IS GREATER THAN 10, LAZY SOLUTION FOR NOW
        var openNodes : BracketNode[][] = Array.from({ length: 10 }, () => Array());
        
        let origin = {...temp}

        if (temp) {
            var q = [];
    
            q.push(origin);
    
            while (q.length > 0) {
    
                let front : BracketNode | undefined = q.shift();
                if (!front) { break; }
                temp = front

                if (temp.right !== null) {
                    q.push(temp.right);
                } 
                else {
                    openNodes[temp.level].push(temp)
                }

                if (temp.left !== null) {
                    q.push(temp.left);
                } 
            }

            q.push(origin)

            while (q.length > 0) {

                let front : BracketNode | undefined = q.shift();
                if (!front) { break; }
                temp = front

                if (temp.left !== null) {
                    q.push(temp.left)
                }

                if (temp.right !== null) {
                    q.push(temp.right);
                } 

                if (temp.left === null && temp.right === null) {
                    openNodes[temp.level].push(temp)
                }
            }
        }

        return openNodes.flat()
    }

    if (!numLowerSets) {

        var upperFinals = CreateBracketNode(0, 0, null, null)
        
        for (let i = 1; i < numUpperSets; i++) {
            insertNode(upperFinals, i, nearestPowerOf2(numPlayers) - 1, 'U', [])
        }
        return upperFinals
    }
    else {

        let bracketReset = CreateBracketNode(2, -1, null, null)

        let grandFinals = CreateBracketNode(0, 0, bracketReset, bracketReset)

        bracketReset.right = grandFinals

        const rightNode = CreateBracketNode(numUpperSets + 2, 1, grandFinals, null) //Lower Final
        grandFinals.right = rightNode

        // Lower Bracket
        for (let i = numUpperSets + 3; i <= numSets; i++) {
            insertNode(grandFinals.right, i, nearestPowerOf2(numPlayers) * 2, 'L', [])
        }

        // Gets an ordered list of lower bracket set nodes that are open to upper bracket contenders to fall to
        let data = getOpenNodes(grandFinals.right)
        data.forEach((openNode) => {
            console.log(openNode)
        })
        let dataFront : BracketNode | undefined = data.shift();
        if (dataFront) {
            grandFinals.left = CreateBracketNode(1, 2, grandFinals, dataFront)

            // Upper Bracket
            for (let i = 3; i <= numUpperSets + 1; i++) {
                insertNode(grandFinals.left, i, nearestPowerOf2(numPlayers), 'U', data)
            }
        }

        console.log(grandFinals)
        return grandFinals
    }
}

function traverse(node : BracketNode | null): void {
    if (node) {
        console.log(`${node.value} : ${node.level}`)
        traverse(node.left)
        traverse(node.right)
    }
}

export function getMaxDepth(node : BracketNode | null): number {
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

export const treeToArray = (node : BracketNode, maxDepth : number) => {

    var treeMap : BracketNode[][] = Array.from({ length : maxDepth + 1 }, () => []);

    if (node && maxDepth > 1) {
        var q = [];

        q.push(node);

        while (q.length > 0) {

            let front : BracketNode | undefined = q.shift();
            if (!front) { break; }
            const temp : BracketNode = front

            if (temp.left !== null) {
                q.push(temp.left);
            } 
            if (temp.right !== null) {
                q.push(temp.right);
            }

            treeMap[temp.level + 1].push(temp)
        }
    }

    return treeMap
}