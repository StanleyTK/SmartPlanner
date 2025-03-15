from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from tags.models import Tag  # Import Tag model

class CreateTagView(APIView):
    def post(self, request):
        """
        Handles POST requests to create a new tag for the authenticated user using Django ORM.
        """
        authorization_token = request.headers.get("Authorization")
        data = request.data

        if not authorization_token:
            return Response({'error': 'Authorization token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = Token.objects.get(key=authorization_token)
            user = token.user
        except Token.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)

        tag_name = data.get('name')
        if not tag_name:
            return Response({'error': 'Tag name is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if tag already exists using ORM
        if Tag.objects.filter(user=user, name=tag_name).exists():
            return Response({'error': 'Tag already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Create tag using ORM
        tag = Tag.objects.create(user=user, name=tag_name)

        return Response({'message': 'Tag created successfully', 'tag_id': tag.id}, status=status.HTTP_201_CREATED)


class GetTagsView(APIView):
    def get(self, request):
        """
        Handles GET requests to retrieve all tags for the authenticated user using Django ORM.
        """
        authorization_token = request.headers.get("Authorization")

        if not authorization_token:
            return Response({'error': 'Authorization token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = Token.objects.get(key=authorization_token)
            user = token.user
        except Token.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)

        # Fetch tags using ORM
        tags = Tag.objects.filter(user=user).values('id', 'name')

        return Response({'tags': list(tags)}, status=status.HTTP_200_OK)


class DeleteTagView(APIView):
    def delete(self, request):
        """
        Handles DELETE requests to delete a tag for the authenticated user using Django ORM.
        """
        authorization_token = request.headers.get("Authorization")
        tag_id = request.data.get('tag_id')

        if not authorization_token or not tag_id:
            return Response({'error': 'Authorization token and tag ID are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = Token.objects.get(key=authorization_token)
            user = token.user
        except Token.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            tag = Tag.objects.get(id=tag_id, user=user)
        except Tag.DoesNotExist:
            return Response({'error': 'Tag not found'}, status=status.HTTP_404_NOT_FOUND)

        # Remove tag association in tasks before deleting the tag
        tag.task_set.update(tag=None)

        # Delete the tag using ORM
        tag.delete()

        return Response({'message': 'Tag deleted successfully'}, status=status.HTTP_200_OK)
