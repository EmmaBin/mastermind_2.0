import random


def generate_random(counts, min_num, max_num):
    result = ''
    for _ in range(counts):
        random_num = random.randint(min_num, max_num)
        result += str(random_num)
    return result
