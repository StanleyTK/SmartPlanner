from django.contrib.auth.hashers import make_password, check_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from users.models import CustomUser

class RegisterView(APIView):
    def post(self, request):
        """
        Handles user registration using Django ORM.
        """
        data = request.data
        username = data.get('username')
        email = data.get('email')
        name = data.get('name', '')
        password = data.get('password')

        if not (username and email and password):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(username=username).exists():
            return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=email).exists():
            return Response({'error': 'Email already taken'}, status=status.HTTP_400_BAD_REQUEST)

        # Hash the password
        hashed_password = make_password(password)

        # Create the user using ORM
        user = CustomUser.objects.create(username=username, email=email, name=name, password=hashed_password)

        # Generate authentication token
        token, _ = Token.objects.get_or_create(user=user)

        return Response({'token': token.key}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    def post(self, request):
        """
        Handles user login using Django ORM.
        """
        data = request.data
        username = data.get('username')
        password = data.get('password')

        if not (username and password):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(username=username)  # ORM query
        except CustomUser.DoesNotExist:
            return Response({'error': 'Invalid login credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        if not check_password(password, user.password):
            return Response({'error': 'Invalid login credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate or get existing authentication token
        token, _ = Token.objects.get_or_create(user=user)

        return Response({'token': token.key}, status=status.HTTP_200_OK)


class DeleteUserView(APIView):
    def delete(self, request):
        """
        Handles user deletion using Django ORM.
        """
        authorization_token = request.headers.get("Authorization")

        if not authorization_token:
            return Response({'error': 'Authorization token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the user associated with the token
            token = Token.objects.get(key=authorization_token)
            user = token.user
        except Token.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)

        # Delete related records using ORM
        user.tasks_task_set.all().delete()
        user.tags_tag_set.all().delete()
        token.delete()
        user.delete()

        return Response({'message': 'User and all associated data deleted successfully'}, status=status.HTTP_200_OK)
