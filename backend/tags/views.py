from django.db import connection
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

class CreateTagView(APIView):
    def post(self, request):
        """
        Handles POST requests to create a new tag for the authenticated user.

        Validates the authorization token and extracts the user ID associated with 
        the token. Retrieves the tag name from the request data and verifies the tag 
        doesn't already exist for the user.

        Inserts a new tag record into the database with the provided details. 
        Returns a success message with the created tag ID upon successful creation.

        Returns:
            Response: A JSON response with a success message and created tag ID, 
                      or an error message and appropriate HTTP status code if 
                      validation fails or an error occurs.
        """
        authorization_token = request.headers.get("Authorization")
        data = request.data

        if not authorization_token:
            return Response({'error': 'Authorization token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = Token.objects.get(key=authorization_token)
            user_id = token.user_id
        except Token.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)

        tag_name = data.get('name')
        if not tag_name:
            return Response({'error': 'Tag name is required'}, status=status.HTTP_400_BAD_REQUEST)

        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT COUNT(*) FROM tags_tag WHERE user_id = %s AND name = %s", 
                [user_id, tag_name]
            )
            tag_exists = cursor.fetchone()[0]

            if tag_exists:
                return Response({'error': 'Tag already exists'}, status=status.HTTP_400_BAD_REQUEST)

            cursor.execute(
                "INSERT INTO tags_tag (user_id, name) VALUES (%s, %s) RETURNING id", 
                [user_id, tag_name]
            )
            tag_id = cursor.fetchone()[0]

        return Response({'message': 'Tag created successfully', 'tag_id': tag_id}, status=status.HTTP_201_CREATED)


class GetTagsView(APIView):
    def get(self, request):
        """
        Handles GET requests to retrieve all tags for the authenticated user.

        Validates the authorization token and extracts the user ID associated with 
        the token. Fetches all tags belonging to the user and constructs a list of 
        tags with their details. Returns the list of tags in the response.

        Returns:
            Response: A JSON response with the list of tags and their details, 
                    or an error message and appropriate HTTP status code if 
                    validation fails or an error occurs.
        """

        authorization_token = request.headers.get("Authorization")

        if not authorization_token:
            return Response({'error': 'Authorization token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = Token.objects.get(key=authorization_token)
            user_id = token.user_id
        except Token.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)

        with connection.cursor() as cursor:
            cursor.execute("SELECT id, name FROM tags_tag WHERE user_id = %s", [user_id])
            tags = cursor.fetchall()

        tag_list = [{'id': tag[0], 'name': tag[1]} for tag in tags]

        return Response({'tags': tag_list}, status=status.HTTP_200_OK)



class DeleteTagView(APIView):
    def delete(self, request):
        """
        Handles DELETE requests to delete a tag for the authenticated user.

        Validates the authorization token and extracts the user ID associated with 
        the token. Retrieves the tag ID from the request data and verifies the tag 
        exists and is owned by the user.

        Sets the tag_id of tasks associated with this tag to NULL before deleting the tag.

        Returns:
            Response: A JSON response with a success message, or an error message and 
                    appropriate HTTP status code if validation fails or an error 
                    occurs.
        """
        authorization_token = request.headers.get("Authorization")
        tag_id = request.data.get('tag_id')

        if not authorization_token or not tag_id:
            return Response({'error': 'Authorization token and tag ID are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = Token.objects.get(key=authorization_token)
            user_id = token.user_id
        except Token.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)

        with connection.cursor() as cursor:
            cursor.execute("UPDATE tasks_task SET tag_id = NULL WHERE tag_id = %s AND user_id = %s", [tag_id, user_id])
            cursor.execute("DELETE FROM tags_tag WHERE id = %s AND user_id = %s", [tag_id, user_id])

        return Response({'message': 'Tag deleted successfully'}, status=status.HTTP_200_OK)
