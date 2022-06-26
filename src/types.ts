export interface Game {
    id: string;
    player_a_key: string;
    player_b_key: string;
    gameState: TicTacToeGameState;
    is_playing: boolean;
    player_a_move: boolean;
    player_a_name: string;
    player_b_name: string;
    player_a_number: string;
    player_b_number: string;
}

export interface TicTacToeGameState {
    board: string[][];
    turn: number;
    type: "ttt"
}
