import requests
import json

url = "http://localhost:8000/api/v1/auth/login"
payload = {
    "username": "student@test.com",
    "password": "password123"
}
headers = {
    "Content-Type": "application/x-www-form-urlencoded"
}

print("Testing login with:")
print(f"URL: {url}")
print(f"Payload: {json.dumps(payload, indent=2)}")

try:
    response = requests.post(url, data=payload, headers=headers)
    print(f"\nStatus Code: {response.status_code}")
    print("Response Headers:")
    for header, value in response.headers.items():
        print(f"  {header}: {value}")
    print("\nResponse Body:")
    try:
        print(json.dumps(response.json(), indent=2))
    except ValueError:
        print(response.text)
except requests.exceptions.RequestException as e:
    print(f"\nError making request: {e}")
    if hasattr(e, 'response') and e.response is not None:
        print(f"Response status: {e.response.status_code}")
        print(f"Response text: {e.response.text}")
