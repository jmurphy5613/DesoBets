export interface Game {
    id: string;
    player_a_key: string;
    player_b_key: string;
    gameState: string;
    is_playing: boolean;
    player_a_move: boolean;
    player_a_name: string;
    player_b_name: string;
}