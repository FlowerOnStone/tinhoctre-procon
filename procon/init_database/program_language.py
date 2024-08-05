from api.models import ProgramLanguage
from csv import DictReader

with open("init_database/program_language.csv", "r") as f:
    reader = DictReader(f)
    for row in reader:
        name = row["name"]
        compile_args = row["compile_args"]
        extension = row["extension"]
        ProgramLanguage.objects.create(name=name, compile_args=compile_args, extension=extension)
        print(f"Program Language {name} created.")