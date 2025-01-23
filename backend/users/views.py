from django.db import connection
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

class RegisterView(APIView):
    def post(self, request):
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
        authorization_token = request.headers.get("Authorization")

        if not authorization_token:
            return Response({'error': 'Authorization token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the token and get the associated user ID
            token = Token.objects.get(key=authorization_token)
            user_id = token.user_id
        except Token.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)

        # Use raw SQL queries to delete the related token first
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM authtoken_token WHERE user_id = %s", [user_id])
            cursor.execute("DELETE FROM users_customuser WHERE id = %s", [user_id])

        return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)


class UpdateUserView(APIView):
    def post(self, request):
        authorization_token = request.headers.get("Authorization")
        data = request.data

        if not authorization_token:
            return Response({'error': 'Authorization token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the token
            token = Token.objects.get(key=authorization_token)
            user_id = token.user_id
        except Token.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)

        # Update user details
        with connection.cursor() as cursor:
            if 'username' in data:
                cursor.execute("UPDATE users_customuser SET username = %s WHERE id = %s", [data['username'], user_id])
            if 'email' in data:
                cursor.execute("UPDATE users_customuser SET email = %s WHERE id = %s", [data['email'], user_id])
            if 'name' in data:
                cursor.execute("UPDATE users_customuser SET name = %s WHERE id = %s", [data['name'], user_id])
            if 'password' in data:
                hashed_password = make_password(data['password'])
                cursor.execute("UPDATE users_customuser SET password = %s WHERE id = %s", [hashed_password, user_id])

        return Response({'message': 'User information updated successfully'}, status=status.HTTP_200_OK)
