if __name__ == "__main__":
    with open("final_task.csv", "w") as out_file, open("newly_confirmed_cases.csv", "r") as in_file:
        out_file.write(in_file.readline())
        for line in in_file.readlines():
            if line.startswith("2021"):
                out_file.write(line[5:])
