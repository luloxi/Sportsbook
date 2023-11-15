// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GPTicTacToe {
    address public owner;
    uint256 public taxRate = 3; // 3% tax
    uint256 public gameIdCounter = 1;

    enum GameState {
        Open,
        InProgress,
        Player1Won,
        Player2Won,
        Draw,
        Canceled
    }

    struct Game {
        address player1;
        address player2;
        uint256 betAmount;
        uint256 startTime;
        GameState state;
        uint8[9] board; // 0: empty, 1: X, 2: O
    }

    mapping(address => uint256) public balances;
    mapping(address => bool) public allowedWithdrawal;

    mapping(uint256 => Game) public games;

    event GameCreated(uint256 indexed gameId, address indexed player1, address indexed player2, uint256 betAmount);
    event MoveMade(uint256 indexed gameId, address indexed player, uint8 position);
    event GameFinished(uint256 indexed gameId, address indexed winner, GameState state);
    event PrizeClaimed(uint256 indexed gameId, address indexed winner, uint256 amount);
    event GameCanceled(uint256 indexed gameId, address indexed canceler);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    modifier onlyPlayers(uint256 gameId) {
        require(msg.sender == games[gameId].player1 || msg.sender == games[gameId].player2, "Not a player");
        _;
    }

    modifier onlyValidMove(uint256 gameId, uint8 position) {
        require(games[gameId].board[position] == 0, "Invalid move");
        _;
    }

    modifier onlyDuringGame(uint256 gameId) {
        require(games[gameId].state == GameState.InProgress, "Game not in progress");
        _;
    }

    modifier onlyAfterGame(uint256 gameId) {
        require(
            games[gameId].state == GameState.Player1Won || games[gameId].state == GameState.Player2Won
                || games[gameId].state == GameState.Draw || games[gameId].state == GameState.Canceled,
            "Game not finished"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createGame(address player2, uint256 betAmount) external payable {
        require(msg.value == betAmount, "Incorrect bet amount");
        uint256 gameId = uint256(keccak256(abi.encodePacked(gameIdCounter, block.timestamp, msg.sender, player2)));

        games[gameId] = Game({
            player1: msg.sender,
            player2: player2,
            betAmount: betAmount,
            startTime: block.timestamp,
            state: GameState.InProgress,
            board: [0, 0, 0, 0, 0, 0, 0, 0, 0]
        });

        gameIdCounter++;

        emit GameCreated(gameId, msg.sender, player2, betAmount);
    }

    function makeMove(uint256 gameId, uint8 position)
        external
        onlyPlayers(gameId)
        onlyDuringGame(gameId)
        onlyValidMove(gameId, position)
    {
        require(msg.sender == getCurrentPlayer(gameId), "Not your turn");
        require(position < 9, "Invalid position");

        uint8 currentPlayerSymbol = getCurrentPlayerSymbol(gameId);
        games[gameId].board[position] = currentPlayerSymbol;

        emit MoveMade(gameId, msg.sender, position);

        if (checkWin(gameId, currentPlayerSymbol)) {
            finishGame(gameId, msg.sender, GameState.Player1Won);
        } else if (checkDraw(gameId)) {
            finishGame(gameId, address(0), GameState.Draw);
        } else {
            toggleTurn(gameId);
        }
    }

    function claimPrize(uint256 gameId) external onlyAfterGame(gameId) {
        address winner = getWinner(gameId);
        require(winner == msg.sender, "You are not the winner");

        uint256 prizeAmount = games[gameId].betAmount * 2;
        balances[msg.sender] += prizeAmount;

        emit PrizeClaimed(gameId, msg.sender, prizeAmount);

        resetGame(gameId);
    }

    function cancelGame(uint256 gameId) external onlyPlayers(gameId) {
        require(msg.sender == games[gameId].player1, "Not player1");

        games[gameId].state = GameState.Canceled;
        allowedWithdrawal[games[gameId].player1] = true;

        emit GameCanceled(gameId, msg.sender);
    }

    function withdraw() external {
        require(allowedWithdrawal[msg.sender], "Not allowed to withdraw");
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance to withdraw");

        balances[msg.sender] = 0;
        allowedWithdrawal[msg.sender] = false;

        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    function setTaxRate(uint256 newRate) external onlyOwner {
        require(newRate <= 10, "Tax rate can't exceed 10%");
        taxRate = newRate;
    }

    function withdrawTax() external onlyOwner {
        uint256 taxAmount = address(this).balance * taxRate / 100;
        require(taxAmount > 0, "No tax to withdraw");

        (bool success,) = owner.call{value: taxAmount}("");
        require(success, "Tax withdrawal failed");
    }

    // Internal functions

    function getCurrentPlayer(uint256 gameId) internal view returns (address) {
        return (block.timestamp / 2) % 2 == 0 ? games[gameId].player1 : games[gameId].player2;
    }

    function getCurrentPlayerSymbol(uint256 gameId) internal view returns (uint8) {
        return getCurrentPlayer(gameId) == games[gameId].player1 ? 1 : 2;
    }

    function toggleTurn(uint256 gameId) internal {
        allowedWithdrawal[games[gameId].player1] = !allowedWithdrawal[games[gameId].player1];
        allowedWithdrawal[games[gameId].player2] = !allowedWithdrawal[games[gameId].player2];
    }

    function checkWin(uint256 gameId, uint8 playerSymbol) internal view returns (bool) {
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

    function checkDraw(uint256 gameId) internal view returns (bool) {
        for (uint8 i = 0; i < 9; i++) {
            if (games[gameId].board[i] == 0) {
                return false; // Game still has empty spots
            }
        }

        return true; // All spots filled, but no winner
    }

    function finishGame(uint256 gameId, address winner, GameState state) internal {
        games[gameId].state = state;
        emit GameFinished(gameId, winner, state);
    }

    function resetGame(uint256 gameId) internal {
        delete games[gameId];
    }

    function getWinner(uint256 gameId) internal view returns (address) {
        uint8 winnerSymbol = getCurrentPlayerSymbol(gameId) == 1 ? 2 : 1;
        return winnerSymbol == 1 ? games[gameId].player1 : games[gameId].player2;
    }
}
