import random


def generate_random(counts, min_num, max_num):
    result = ''
    for _ in range(int(counts)):
        random_num = random.randint(int(min_num), int(max_num))
        result += str(random_num)
    return result
