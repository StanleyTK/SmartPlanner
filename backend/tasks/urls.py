from django.urls import path
from .views import CreateTaskView, UpdateTaskView, DeleteTaskView, GetTasksView, GetTasksByDateView

urlpatterns = [
    path('create/', CreateTaskView.as_view(), name='create_task'),
    path('update/', UpdateTaskView.as_view(), name='update_task'),
    path('delete/', DeleteTaskView.as_view(), name='delete_task'),
    path('get/', GetTasksView.as_view(), name='get_tasks'),
    path('get-by-date/', GetTasksByDateView.as_view(), name='get_tasks_by_date'),
]
