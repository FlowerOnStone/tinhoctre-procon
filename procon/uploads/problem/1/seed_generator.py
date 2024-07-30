import random

def choose_random_move(board):
    available_moves = [i for i, spot in enumerate(board) if spot == ' ']
    move = random.choice(available_moves)
    x, y = divmod(move, 3)
    return x, y

def main():
    # Initialize an empty board
    board = [' '] * 9

    while True:
        # Read input from the agent
        input_data = input()
        
        if input_data:
            # Update the board with the opponent's move
            x, y = map(int, input_data.split())
            board[x * 3 + y] = 'O'  # Opponent uses 'O'
        
        # Choose a random move
        move = choose_random_move(board)
        board[move[0] * 3 + move[1]] = 'X'  # Player 1 uses 'X'

        # Send the move back to the agent
        print(f"{move[0]} {move[1]}")

if __name__ == "__main__":
    main()