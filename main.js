// Variables

let nGlobal = 0 // Número de nodos
let adjGlobal = [] // Lista de adyacencia para el árbol
let tinGlobal = [] // Array para almacenar tiempos de entrada
let toutGlobal = [] // Array para almacenar tiempos de salida
let timerGlobal = 0 // Contador de tiempo global

function dfsTimers(uNode, pNode) {
    timerGlobal++
    tinGlobal[uNode] = timerGlobal

    // Si el nodo no tiene vecinos, marcarlo como terminado
    if (!adjGlobal[uNode] || adjGlobal[uNode].length === 0) {
        timerGlobal++
        toutGlobal[uNode] = timerGlobal
        return
    }

    // Recorrer los vecinos del nodo actual
    for (const vNeighbor of adjGlobal[uNode]) {
        if (vNeighbor === pNode) {
            continue
        }
        dfsTimers(vNeighbor, uNode)
    }

    timerGlobal++
    toutGlobal[uNode] = timerGlobal
}

function esAncestroDfs(uQuery, vQuery) {
    // Validación para asegurarse de que las consultas son válidas
    if (!(uQuery >= 1 && uQuery <= nGlobal && vQuery >= 1 && vQuery <= nGlobal)) {
        return false
    }

    // Validación de tiempos de entrada
    if (!tinGlobal[uQuery] || !tinGlobal[vQuery] || !toutGlobal[uQuery] || !toutGlobal[vQuery]) {
        return false
    }   
    // Verificar si uQuery es ancestro de vQuery
    return tinGlobal[uQuery] <= tinGlobal[vQuery] && toutGlobal[uQuery] >= toutGlobal[vQuery]
}

function solve(inputLines) {
    // Reiniciar variables globales despues de cada ejecución
    nGlobal = 0
    adjGlobal = []
    tinGlobal = []
    toutGlobal = []
    timerGlobal = 0
    let lineIndex = 0

    // Leer la primera línea para obtener n y q
    const firstLine = inputLines[lineIndex++]
    if (!firstLine) {
        console.error("No input provided")
        return
    }
    const [nStr, qStr] = firstLine.trim().split(' ')
    nGlobal = parseInt(nStr)
    const qCount = parseInt(qStr)

    // Validar n y q
    if (isNaN(nGlobal) || isNaN(qCount) || nGlobal < 1 || qCount < 0) {
        console.error("Invalid input for n or q")
        return
    }

    // Inicializar estructuras de datos
    adjGlobal = Array(nGlobal + 1).fill(null).map(() => [])
    tinGlobal = Array(nGlobal + 1).fill(0)
    toutGlobal = Array(nGlobal + 1).fill(0)

    // Leer las aristas
    if (nGlobal > 1) { // Solo leer aristas si n > 1
        for (let i = 0; i < nGlobal - 1; i++) {
            if (lineIndex >= inputLines.length) {
                console.error("Insufficient input for edges") 
                return
            }
            const edgeLine = inputLines[lineIndex++]
            if (!edgeLine) {
                console.error("Empty edge line encountered")
                return
            }
            const [uEdgeStr, vEdgeStr] = edgeLine.trim().split(' ')
            const uEdge = parseInt(uEdgeStr)
            const vEdge = parseInt(vEdgeStr)

            if (isNaN(uEdge) || isNaN(vEdge) || uEdge < 1 || uEdge > nGlobal || vEdge < 1 || vEdge > nGlobal || uEdge === vEdge) {
                console.error(`Error: Invalid edge at ${uEdgeStr}, ${vEdgeStr}.`)
                return
            } // Validacion de los nodos de la arista

            adjGlobal[uEdge].push(vEdge)
            adjGlobal[vEdge].push(uEdge)
        }
    }

    // Inicializar el temporizador y ejecutar DFS para calcular tin y tout
    if (nGlobal > 0) {
        dfsTimers(1, 0) // Nodo 1 es root, 0 es un padre ficticio
    }

    // Leer las Q consultas
    const resultados = [];
    for (let i = 0; i < qCount; i++) {
        if (lineIndex >= inputLines.length) {
            resultados.push("Insufficient input for queries")
            break;
        }
        const queryLine = inputLines[lineIndex++]
        if (!queryLine) {
            resultados.push("Empty query line encountered")
            continue;
        }
        const [uQueryStr, vQueryStr] = queryLine.trim().split(' ')
        const uQuery = parseInt(uQueryStr)
        const vQuery = parseInt(vQueryStr)

        // Validar las consultas
        if (isNaN(uQuery) || isNaN(vQuery)) {
            resultados.push(`Error: Invalid query at ${uQueryStr}, ${vQueryStr}.`)
            continue;
        }
        if (!(uQuery >= 1 && uQuery <= nGlobal && vQuery >= 1 && vQuery <= nGlobal)) {
            resultados.push(`Error: Query out of bounds at ${uQueryStr}, ${vQueryStr}.`)
            continue;
        }

        // Verificar si uQuery es ancestro de vQuery
        resultados.push(esAncestroDfs(uQuery, vQuery) ? "YES" : "NO");
    }

    resultados.forEach(res => console.log(res));

}

// Logica para leer la entrada desde stdin
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
})

const lines = [];
rl.on('line', (line) => {
    lines.push(line)
})

rl.on('close', () => {
    solve(lines);
})