from api.models import Timezone
from csv import DictReader

with open("init_database/timezones.csv", "r") as f:
    reader = DictReader(f)
    for row in reader:
        timezone = row["timezone"]
        zone = ""
        location = ""
        if "/" in timezone:
            zone = timezone.split("/")[0]
            location = timezone.replace(zone + "/", "")
        else:
            zone = timezone
        offset = int(row["offset"])
        offset_dst = int(row["offset_dst"])
        print(zone, location, offset, offset_dst)
        timezone = Timezone.objects.create(
            zone=zone, location=location, offset=offset, offset_dst=offset_dst
        )
        timezone.save()
        print("add {zone}/{location}")
