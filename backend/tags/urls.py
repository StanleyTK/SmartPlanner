from django.urls import path
from .views import CreateTagView, GetTagsView, DeleteTagView

urlpatterns = [
    path('create/', CreateTagView.as_view(), name='create_tag'),
    path('get/', GetTagsView.as_view(), name='get_tags'),
    path('delete/', DeleteTagView.as_view(), name='delete_tags')
]
