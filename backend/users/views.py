from django.db import connection
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

class RegisterView(APIView):
    def post(self, request):
        """
        Handles POST requests to create a new user account.

        Validates the request data for the presence of required fields (username,
        email, password) and hashes the password. Inserts the user into the
        database and creates an authentication token.

        Returns:
            Response: A JSON response with the authentication token, or an error
                message and appropriate HTTP status code if validation fails or
                an error occurs.
        """
        data = request.data
        username = data.get('username')
        email = data.get('email')
        name = data.get('name', '')
        password = data.get('password')

        if not (username and email and password):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        # Hash the password
        hashed_password = make_password(password)

        # Insert user into the database
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO users_customuser (username, email, name, password)
                VALUES (%s, %s, %s, %s)
            """, [username, email, name, hashed_password])

            # Get the new user's ID
            cursor.execute("SELECT id FROM users_customuser WHERE username=%s", [username])
            user_id = cursor.fetchone()[0]

        # Create an authentication token
        token, _ = Token.objects.get_or_create(user_id=user_id)

        return Response({'token': token.key}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    def post(self, request):
        """
        Handles login requests.

        Validates the request data for the presence of required fields (username,
        password) and checks the credentials against the database. If the
        credentials are valid, returns an authentication token.

        Returns:
            Response: A JSON response with the authentication token, or an error
                message and appropriate HTTP status code if validation fails or
                an error occurs.
        """
        data = request.data
        username = data.get('username')
        password = data.get('password')

        if not (username and password):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch user data from the database
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, password FROM users_customuser WHERE username=%s", [username])
            user_data = cursor.fetchone()

        if not user_data:
            return Response({'error': 'Invalid login credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        user_id, stored_password = user_data

        # Check the password
        if not check_password(password, stored_password):
            return Response({'error': 'Invalid login credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        # Create or fetch the token
        token, _ = Token.objects.get_or_create(user_id=user_id)

        return Response({'token': token.key}, status=status.HTTP_200_OK)


class DeleteUserView(APIView):
    def delete(self, request):
        """
        Handles DELETE requests to remove a user account and all associated data.

        Validates the request for an authorization token. If the token is valid,
        retrieves the corresponding user ID and deletes all related records from
        the database, including tasks, tags, authentication tokens, and the user
        account itself.

        Returns:
            Response: A JSON response indicating successful deletion, or an error
            message and appropriate HTTP status code if validation fails or an
            error occurs.
        """

        authorization_token = request.headers.get("Authorization")

        if not authorization_token:
            return Response({'error': 'Authorization token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the token and get the associated user ID
            token = Token.objects.get(key=authorization_token)
            user_id = token.user_id
        except Token.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)

        # Use raw SQL queries to delete related records first
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM tasks_task WHERE user_id = %s", [user_id])
            cursor.execute("DELETE FROM tags_tag WHERE user_id = %s", [user_id])
            cursor.execute("DELETE FROM authtoken_token WHERE user_id = %s", [user_id])
            cursor.execute("DELETE FROM users_customuser WHERE id = %s", [user_id])

        return Response({'message': 'User and all associated data deleted successfully'}, status=status.HTTP_200_OK)
