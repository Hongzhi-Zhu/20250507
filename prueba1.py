import requests

def get_api_data(url: str) -> list[tuple]:
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()

    return list(data.items())

if __name__ == '__main__':
    url1 = "https://invelonjobinterview.herokuapp.com/api/test1"
    result1 = get_api_data(url1)
    print(result1)
    url2 = "https://invelonjobinterview.herokuapp.com/api/test2"
    result2 = get_api_data(url2)
    print(result2)
