import os
import sys
import requests


def init_working_dir():
    os.chdir(os.path.dirname(sys.argv[0]))


if __name__ == '__main__':
    base_url = 'http://gs-api:3000'
    init_working_dir()
    file = open('temp_book.txt', 'r')
    response = requests.post('{}/book'.format(base_url), data={'content': file.read()})
    print(response.text.encode('utf-8'))
