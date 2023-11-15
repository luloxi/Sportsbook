// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * @title A Tic Tac Toe game
 * @author Lulox
 * @notice This contract is for creating a bet between two parts on the outcome of a Tic Tac Toe Game
 */
contract TicTacToe {
    uint256 public gameIdCounter = 1;

    enum GameState {
        PENDING,
        PLAYING,
        PLAYER1WON,
        PLAYER2WON,
        TIE,
        CANCELED
    }

    struct Game {
        address player1;
        address player2;
        GameState state;
        uint256 bet;
        uint256 lastMoveTime;
        bool player1Withdrawn; // Indicates whether player 1 has withdrawn or not
        bool player2Withdrawn; // Indicates whether player 2 has withdrawn or not
        uint8[9] board; // 0: empty, 1: X, 2: O
    }

    mapping(bytes32 => Game) public games;

    event GameCreated(bytes32 indexed gameId, address indexed player1, address indexed player2, uint256 bet);
    event GameAccepted(bytes32 indexed gameId, address indexed team1, address indexed team2);
    event MoveMade(bytes32 indexed gameId, address indexed player, uint8 position);
    event GameFinished(bytes32 indexed gameId, address indexed winner, GameState state);

    modifier onlyPlayers(bytes32 gameId) {
        require(msg.sender == games[gameId].player1 || msg.sender == games[gameId].player2, "Not a player");
        _;
    }

    modifier onlyDuringGame(bytes32 gameId) {
        require(games[gameId].state == GameState.PLAYING, "Game not in progress");
        _;
    }

    modifier onlyValidMove(bytes32 gameId, uint8 position) {
        require(games[gameId].board[position] == 0, "Invalid move");
        _;
    }

    function createGame(address _player2) external payable returns (bytes32 gameId) {
        gameId = keccak256(abi.encodePacked(gameIdCounter, block.timestamp, msg.sender, _player2));

        games[gameId] = Game({
            player1: msg.sender,
            player2: _player2,
            state: GameState.PENDING,
            bet: msg.value,
            lastMoveTime: block.timestamp,
            player1Withdrawn: false,
            player2Withdrawn: false,
            board: [0, 0, 0, 0, 0, 0, 0, 0, 0]
        });

        gameIdCounter++;

        emit GameCreated(gameId, msg.sender, _player2, msg.value);
    }

    function makeMove(bytes32 _gameId, uint8 position)
        external
        payable
        onlyPlayers(_gameId)
        onlyDuringGame(_gameId)
        onlyValidMove(_gameId, position)
    {
        if (games[_gameId].player2 == msg.sender && games[_gameId].state == GameState.PENDING) {
            require(msg.value >= games[_gameId].bet, "Haven't sent enough ETH!");
            acceptGame(_gameId);
        }
        require(msg.sender == getCurrentPlayer(_gameId), "Not your turn");
        require(position < 9, "Invalid position");

        uint8 currentPlayerSymbol = getCurrentPlayerSymbol(_gameId);
        games[_gameId].board[position] = currentPlayerSymbol;

        emit MoveMade(_gameId, msg.sender, position);

        // if (checkWin(_gameId, currentPlayerSymbol)) {
        //     finishGame(_gameId, msg.sender, GameState.PLAYER1WON);
        // } else if (checkDraw(_gameId)) {
        //     finishGame(_gameId, address(0), GameState.TIE);
        // } else {
        //     toggleTurn(_gameId);
        // }
    }

    function getBoard(bytes32 _gameId) external view returns (uint8[9] memory) {
        return games[_gameId].board;
    }

    function acceptGame(bytes32 _gameId) internal {
        games[_gameId].state = GameState.PLAYING;
        games[_gameId].lastMoveTime = block.timestamp;

        emit GameAccepted(_gameId, games[_gameId].player1, games[_gameId].player2);
    }

    function finishGame(bytes32 gameId, address winner, GameState state) internal {
        games[gameId].state = state;
        emit GameFinished(gameId, winner, state);
    }

    function checkWin(bytes32 gameId, uint8 playerSymbol) internal view returns (bool) {
        uint8[3][8] memory winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8], // Rows
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8], // Columns
            [0, 4, 8],
            [2, 4, 6] // Diagonals
        ];

        for (uint8 i = 0; i < 8; i++) {
            uint8[3] memory condition = winConditions[i];
            if (
                games[gameId].board[condition[0]] == playerSymbol && games[gameId].board[condition[1]] == playerSymbol
                    && games[gameId].board[condition[2]] == playerSymbol
            ) {
                return true;
            }
        }

        return false;
    }

    function checkDraw(bytes32 gameId) internal view returns (bool) {
        for (uint8 i = 0; i < 9; i++) {
            if (games[gameId].board[i] == 0) {
                return false; // Game still has empty spots
            }
        }

        return true; // All spots filled, but no winner
    }

    function getCurrentPlayerSymbol(bytes32 gameId) internal view returns (uint8) {
        return getCurrentPlayer(gameId) == games[gameId].player1 ? 1 : 2;
    }

    // What is this function doing?????
    function getCurrentPlayer(bytes32 gameId) internal view returns (address) {
        return (block.timestamp / 2) % 2 == 0 ? games[gameId].player1 : games[gameId].player2;
    }

    // Maybe this could be removed and the turn could be calculated by checking if the amount of moves is even or odd
    function toggleTurn(bytes32 gameId) internal {}
}
