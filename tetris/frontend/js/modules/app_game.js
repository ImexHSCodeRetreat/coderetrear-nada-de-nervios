import * as FetchService from './fetch_service.js';

let selectElement;
let waitRendered;

const loadGame = (se) => {
    selectElement = se;
    waitRendered = false;
    const hash = new URL(window.location.href).hash.substring(1);
    try {
        const pData = hash ? JSON.parse(decodeURIComponent(hash)) : null;
        const pToken = pData ? pData.playerToken : null;
        if (pToken) {
            FetchService.setToken(pToken);
            const gameId = pData.gameId;
            if (gameId) {
                return pollGameState(gameId);
            } else {
                return FetchService.postData('game', {})
                .then(
                    gameStatus => pollGameState(gameStatus.gameId)
                );
            }
        } else {
            window.location.replace(`../..`);
        }
    }
    catch(error) {
        window.location.replace(`../..`);
    }
}

const pollGameState = (gameId) => {
    return FetchService.getData(`game/${gameId}`).then(gameStatus => {
        if (gameStatus.active) {
            if (gameStatus.isCurrentPlayer && !gameStatus.playerSymbol) {
                loadSymbols(gameId)
            } else if ((!gameStatus.isCurrentPlayer && !gameStatus.playerSymbol) || !gameStatus.playerTwo) {
                renderWaiting();
                pollGameState(gameId);
            } else {
                playGame(gameId);
            }
        }
        else {
            throw new InvalidStartState('cannot start a game that ended');
        }
    })
}

const renderWaiting = () => {
    if (!waitRendered) {
        console.log('waiting')
        const container = document.createElement("div");
        container.className = 'progress';
        const loader = document.createElement("div");
        loader.className = 'indeterminate';
        container.appendChild(loader);
        selectElement.innerHTML = 'Esperando a contrincante';
        selectElement.appendChild(container);
        waitRendered = true;
    }
}
const playGame = (gameId) => {
    const playerToken = FetchService.getToken();
    const playerData = { gameId, playerToken };
    const pEndodedData = encodeURIComponent(JSON.stringify(playerData));
    window.location.replace(`./play_game.html#${pEndodedData}`);
}

const loadSymbols = (gameId) => {
    FetchService.getData(`symbol/${gameId}`).then(symbols => {
        const title = document.createElement("span");
        title.innerHTML = 'Seleccione un simbolo';
        selectElement.appendChild(title);
        for (const key in symbols) { 
            const p =  document.createElement("p");
            const label = document.createElement("label");
            const input = document.createElement("input");
            input.type = 'radio';
            input.name = `group-1`; 
            const span = document.createElement("span");
            span.innerHTML = symbols[key];
            label.appendChild(input);
            label.appendChild(span);
            p.appendChild(label);
            selectElement.appendChild(p);
        }
        const button = createSelectButton(gameId);
        selectElement.appendChild(button);
    })
}

const createSelectButton = (gameId) => {
    const selectButton = document.createElement("a");
    selectButton.className = 'waves-effect waves-light btn symbol-select';
    selectButton.onclick = () => {
        const selectedItem = Array.from(document.getElementsByTagName('input')).find(i => i.checked);
        if (selectedItem) {
            selectSymbol(gameId, selectedItem.nextElementSibling.innerText);
        } else {
            console.log('mostrar error');
        }
    }
    selectButton.innerHTML = 'Seleccionar';
    const icon = document.createElement("i");
    icon.className = 'material-icons left';
    icon.innerHTML = 'star_border';
    selectButton.appendChild(icon);
    return selectButton;
}

const selectSymbol = (gameId, symbol) => {
    FetchService.putData(`set_symbol/${gameId}`, {symbol}).then(() => {
        return pollGameState(gameId);
    })
}

class InvalidStartState extends Error {
}


export {loadGame, selectSymbol, InvalidStartState}
