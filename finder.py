import requests
import random
import os
import sys

digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]

#os.system('cls||clear')
print("             \u001b[35;1mStarting Brute Force...\u001b[0m")
print()
print()


def is_code_valid(code):
    request = requests.get("https://kahoot.it/reserve/session/" + code)
    return request

while True:
    code = ""
    for i in range(6):
        code += random.choice(digits)
    result = is_code_valid(code)
    if result.status_code == 200:
        print("\n"+code, end='', flush=True)
        os.system('node index.js '+code)