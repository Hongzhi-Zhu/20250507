import threading

def concurrency_with_coffee():
    print("- I'm tired, Bob! ", end="")

    phrases = {
        1: "are made of coffee? ",
        2: "Do you know ",
        3: "it! ",
        4: "that our bodies ",
        5: "-Try drinking "
    }

    threads = []

    for i in range(1, 6):
        t = threading.Thread()
        threads.append(t)
        t.start()

    join_order = [2, 4, 1, 5, 3]
    for i in join_order:
        threads[i-1].join()
        print(phrases[i], end="")

    print("- You’re right!")

if __name__ == '__main__':
    concurrency_with_coffee()
