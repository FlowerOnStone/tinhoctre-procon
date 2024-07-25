from django.urls import path
from api.views import *
from knox import views as knox_views

urlpatterns = [
    path("register/", RegisterAPI.as_view(), name="register"),  # tested
    path("login/", LoginAPI.as_view(), name="login"),  # tested
    path("logout/", knox_views.LogoutView.as_view(), name="logout"),  # tested
    path(
        "change_user_info/", UpdateUserProfileAPI.as_view(), name="change_user_info"
    ),  # tested
    path(
        "change_password/", UpdatePasswordAPI.as_view(), name="change_password"
    ),  # tested
    path("timezone/", ListTimezoneAPI.as_view(), name="timezone"),  # tested
    path("user/list/", ListUserAPI.as_view(), name="user_list"),  # tested
    path(
        "programlanguage/",
        ListProgramLanguageAPI.as_view(),
        name="list_program_language",
    ),  # tested
    path(
        "problem/", ListCreateProblemAPI.as_view(), name="list_create_problem"
    ),  # tested
    path(
        "problem/<slug:problem_slug>/",
        RetrieveUpdateDestroyProblemAPI.as_view(),
        name="view_change_delete_problem",
    ),  # tested
    path(
        "problem/<slug:problem_slug>/testcase/",
        RetrieveUpdateDestroyTestcaseAPI.as_view(),
        name="view_change_delete_problem_testcase",
    ),
    path(
        "submission/",
        ListSubmissionAPI.as_view(),
        name="list_submission",
    ),  # tested
    path(
        "problem/<slug:problem_slug>/submit/",
        SubmitProblemAPI.as_view(),
        name="submit_problem",
    ),  # tested
    path(
        "problem/<slug:problem_slug>/submission/",
        ListProblemSubmissionAPI.as_view(),
        name="list_submission_of_problem",
    ),  # tested
    path(
        "submission/<int:pk>/",
        RetrieveSubmissionAPI.as_view(),
        name="view_submission",
    ),  # tested
    path("tournament/", ListCreateTournamentAPI.as_view(), name="create_tournament"),
    path(
        "tournament/<int:id>/",
        RetrieveTournamentAPI.as_view(),
        name="retrieve_tournament",
    ),
    path(
        "tournament/<int:id>/group/",
        RetrieveTouramentGroupAPI.as_view(),
        name="view_tournament_group",
    ),
    path(
        "group/<int:id>/",
        RetrieveGroupRoundAPI.as_view(),
        name="view_group_round",
    ),
    path(
        "round/",
        ListCreateRoundAPI.as_view(),
        name="list_create_round",
    ),
    path(
        "round/<int:id>/match/",
        ListCreateMatchAPI.as_view(),
        name="list_create_match",
    ),
    path(
        "match/<int:id>/",
        RetrieveMatchAPI.as_view(),
        name="retrieve_match",
    ),
]
