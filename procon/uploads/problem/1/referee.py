import subprocess
import signal
from referee_lib import *


def check_winner(board):
    win_conditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],  # Rows
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],  # Columns
        [0, 4, 8],
        [2, 4, 6],  # Diagonals
    ]
    for condition in win_conditions:
        if board[condition[0]] == board[condition[1]] == board[condition[2]] != ".":
            return board[condition[0]]
    if "." not in board:
        return "Draw"
    return None


def main():
    board = ["."] * 9

    write_to_player_1("-1 -1")

    while True:
        player1_response = read_from_player_1()
        if player1_response == Message.TIMEOUT or player1_response == Message.ERROR:
            write_final_point(0, 1, Message.SECOND_WIN)
            break
        x, y = map(int, player1_response.split())
        board[x * 3 + y] = "X"
        start_write_status()
        write_status(f"1 {x} {y}")
        end_write_status()
        winner = check_winner(board)
        if winner:
            print(f"Winner: {winner}")
            write_step_point(1, 0)
            write_final_point(1, 0, Message.FIRST_WIN)
            break
        else:
            write_step_point(0, 0)

        # Inform Player 2 of Player 1's move
        write_to_player_2(f"{x} {y}")
        player2_response = read_from_player_2()
        if player2_response == Message.TIMEOUT or player2_response == Message.ERROR:
            write_final_point(1, 0, Message.FIRST_WIN)
            break
        x, y = map(int, player2_response.split())
        board[x * 3 + y] = "O"
        start_write_status()
        write_status(f"2 {x} {y}")
        end_write_status()
        winner = check_winner(board)
        if winner:
            print(f"Winner: {winner}")
            write_step_point(0, 1)
            write_final_point(0, 1, Message.SECOND_WIN)
            break
        else:
            write_step_point(0, 0)
        write_to_player_1(f"{x} {y}")


main()
