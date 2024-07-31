#include <iostream>
#include <vector>
#include <cstdlib>
#include <ctime>
#include <sstream>

using namespace std;

pair<int, int> choose_random_move(vector<char>& board) {
    vector<int> available_moves;
    for (int i = 0; i < board.size(); ++i) {
        if (board[i] == ' ') {
            available_moves.push_back(i);
        }
    }
    int move = available_moves[rand() % available_moves.size()];
    return {move / 3, move % 3};
}

int main() {
    srand(time(0));  // Seed the random number generator

    // Initialize an empty board
    vector<char> board(9, ' ');

    while (true) {
        // Read input from the agent
        string input_data;
        getline(cin, input_data);

        if (!input_data.empty()) {
            // Update the board with the opponent's move
            stringstream ss(input_data);
            int x, y;
            ss >> x >> y;
            board[x * 3 + y] = 'X';  // Opponent uses 'X'
        }

        // Choose a random move
        pair<int, int> move = choose_random_move(board);
        board[move.first * 3 + move.second] = 'O';  // Player 2 uses 'O'

        // Send the move back to the agent
        cout << move.first << " " << move.second << endl;
    }

    return 0;
}