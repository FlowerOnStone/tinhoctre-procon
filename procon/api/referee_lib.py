import sys


class Message:
    FIRST_WIN = "F"
    SECOND_WIN = "S"
    DRAW = "D"
    START_INITIAL_STATUS = "START_INITIAL_STATUS"
    WRITE_INITIAL_STATUS = "WRITE_INITIAL_STATUS"
    END_INITIAL_STATUS = "END_INITIAL_STATUS"
    WRITE_TO_PLAYER_1 = "WRITE_TO_PLAYER_1"
    WRITE_TO_PLAYER_2 = "WRITE_TO_PLAYER_2"
    READ_FROM_PLAYER_1 = "READ_FROM_PLAYER_1"
    READ_FROM_PLAYER_2 = "READ_FROM_PLAYER_2"
    STEP_POINT = "STEP_POINT"
    START_STEP_STATUS = "START_STEP_STATUS"
    WRITE_STEP_STATUS = "WRITE_STEP_STATUS"
    END_STEP_STATUS = "END_STEP_STATUS"
    FINAL_POINT = "FINAL_POINT"
    TIMEOUT = "TIMEOUT"
    ERROR = "ERROR"
    DONE = "DONE"
    PLAYER_ERROR = "PLAYER_ERROR"


def write_to_player(msg, write_message):
    print(write_message)
    print(msg)
    sys.stdout.flush()
    message = input()
    if message != Message.DONE:
        return message
    return None


def read_from_player(read_message):
    print(read_message)
    sys.stdout.flush()
    message = input()
    return message


def write_to_player_1(msg: str):
    return write_to_player(msg=msg, write_message=Message.WRITE_TO_PLAYER_1)


def write_to_player_2(msg: str):
    return write_to_player(msg=msg, write_message=Message.WRITE_TO_PLAYER_2)


def read_from_player_1():
    return read_from_player(read_message=Message.READ_FROM_PLAYER_1)


def read_from_player_2():
    return read_from_player(read_message=Message.READ_FROM_PLAYER_2)


def start_write_status():
    print(Message.START_STEP_STATUS)
    sys.stdout.flush()
    message = input()


def write_status(msg):
    print(Message.WRITE_STEP_STATUS)
    print(msg)
    sys.stdout.flush()
    message = input()


def end_write_status():
    print(Message.END_STEP_STATUS)
    sys.stdout.flush()
    message = input()


def start_inital_status():
    print(Message.START_INITIAL_STATUS)
    sys.stdout.flush()
    message = input()


def write_inital_status(msg):
    print(Message.WRITE_INITIAL_STATUS)
    print(msg)
    sys.stdout.flush()
    message = input()


def end_inital_status():
    print(Message.END_INITIAL_STATUS)
    sys.stdout.flush()
    message = input()


def write_step_point(x, y):
    print(Message.STEP_POINT)
    print(x, y)
    sys.stdout.flush()
    message = input()


def write_final_point(x, y, result):
    print(Message.FINAL_POINT)
    sys.stdout.flush()
    print(x, y, result)
    sys.stdout.flush()
    message = input()


def write_player_error(msg):
    print(Message.PLAYER_ERROR)
    print(msg)
    sys.stdout.flush()
    message = input()