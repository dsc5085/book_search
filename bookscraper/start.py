import requests

if __name__ == '__main__':
    base_url = 'http://gs-api:3000'
    response = requests.get('{}/search'.format(base_url), params={'term': 'Hello', 'offset': 0})
    print(response.text)
