from django.contrib import admin
from django import forms

# Register your models here.

from .models import *

admin.site.register(UserProfile)


class ProgramLanguageAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "compile_args", "extension")

admin.site.register(ProgramLanguage, ProgramLanguageAdmin)


class TimezoneAdmin(admin.ModelAdmin):
    list_display = ("id", "zone", "location", "offset", "offset_dst")

admin.site.register(Timezone, TimezoneAdmin)

admin.site.register(Problem)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "problem", "language", "status")

    def get_form(self, request, obj=None, **kwargs):
        kwargs["widgets"] = {"source": forms.Textarea, "log": forms.Textarea}
        return super().get_form(request, obj, **kwargs)


admin.site.register(Submission, SubmissionAdmin)


class TournamentAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "num_group", "problem")


admin.site.register(Tournament, TournamentAdmin)
admin.site.register(Group)
admin.site.register(Round)
admin.site.register(Match)
admin.site.register(TestData)
admin.site.register(DefaultSubmission)
admin.site.register(Challenge)
