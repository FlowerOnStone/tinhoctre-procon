from django.contrib import admin

# Register your models here.

from .models import *

admin.site.register(UserProfile)


class ProgramLanguageAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "compile_args")

admin.site.register(ProgramLanguage, ProgramLanguageAdmin)


class TimezoneAdmin(admin.ModelAdmin):
    list_display = ("id", "zone", "location", "offset", "offset_dst")

admin.site.register(Timezone, TimezoneAdmin)

admin.site.register(Problem)
admin.site.register(Submission)


class TournamentAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "num_group", "problem")


admin.site.register(Tournament, TournamentAdmin)
admin.site.register(Group)
admin.site.register(Round)
admin.site.register(Match)
admin.site.register(TestData)
admin.site.register(DefaultSubmission)
admin.site.register(Challenge)