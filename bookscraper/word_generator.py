import json
import random


class WordGenerator:
    def __init__(self):
        with open('words_dictionary.json') as f:
            words_dict = json.load(f)
            self._words = list(words_dict.keys())

    def generate(self, num):
        generated_words = []
        for i in range(num):
            generated_words.append(random.choice(self._words))
        return generated_words
