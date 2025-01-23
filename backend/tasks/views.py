from django.db import connection
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
class CreateTaskView(APIView):
    def post(self, request):
        authorization_token = request.headers.get("Authorization")
        data = request.data

        if not authorization_token:
            return Response({'error': 'Authorization token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = Token.objects.get(key=authorization_token)
            user_id = token.user_id
        except Token.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)

        title = data.get('title')
        description = data.get('description', '')
        priority = data.get('priority', 2)
        tags = data.get('tags', '')
        date_created = data.get('date_created')

        if not (title and date_created):
            return Response({'error': 'Title and date_created are required'}, status=status.HTTP_400_BAD_REQUEST)

        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO tasks_task (title, user_id, description, priority, tags, date_created, is_completed)
                VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id
            """, [title, user_id, description, priority, tags, date_created, False])
            
            task_id = cursor.fetchone()[0]

        return Response({'message': 'Task created successfully', 'task_id': task_id}, status=status.HTTP_201_CREATED)



class UpdateTaskView(APIView):
    def post(self, request):
        authorization_token = request.headers.get("Authorization")
        data = request.data

        if not authorization_token:
            return Response({'error': 'Authorization token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = Token.objects.get(key=authorization_token)
            user_id = token.user_id
        except Token.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)

        task_id = data.get('task_id')
        if not task_id:
            return Response({'error': 'Task ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        with connection.cursor() as cursor:
            if 'title' in data:
                cursor.execute("UPDATE tasks_task SET title = %s WHERE id = %s AND user_id = %s", [data['title'], task_id, user_id])
            if 'description' in data:
                cursor.execute("UPDATE tasks_task SET description = %s WHERE id = %s AND user_id = %s", [data['description'], task_id, user_id])
            if 'priority' in data:
                cursor.execute("UPDATE tasks_task SET priority = %s WHERE id = %s AND user_id = %s", [data['priority'], task_id, user_id])
            if 'tags' in data:
                cursor.execute("UPDATE tasks_task SET tags = %s WHERE id = %s AND user_id = %s", [data['tags'], task_id, user_id])
            if 'is_completed' in data:
                cursor.execute("UPDATE tasks_task SET is_completed = %s WHERE id = %s AND user_id = %s", [data['is_completed'], task_id, user_id])

        return Response({'message': 'Task updated successfully'}, status=status.HTTP_200_OK)


class DeleteTaskView(APIView):
    def delete(self, request):
        authorization_token = request.headers.get("Authorization")
        task_id = request.data.get("task_id")

        if not authorization_token:
            return Response({'error': 'Authorization token is required'}, status=status.HTTP_400_BAD_REQUEST)

        if not task_id:
            return Response({'error': 'Task ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = Token.objects.get(key=authorization_token)
            user_id = token.user_id
        except Token.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)

        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM tasks_task WHERE id = %s AND user_id = %s", [task_id, user_id])

        return Response({'message': 'Task deleted successfully'}, status=status.HTTP_200_OK)


class GetTasksView(APIView):
    def get(self, request):
        authorization_token = request.headers.get("Authorization")

        if not authorization_token:
            return Response({'error': 'Authorization token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = Token.objects.get(key=authorization_token)
            user_id = token.user_id
        except Token.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, title, description, priority, tags, date_assigned, is_completed 
                FROM tasks_task WHERE user_id = %s
            """, [user_id])
            tasks = cursor.fetchall()

        task_list = []
        for task in tasks:
            task_list.append({
                'id': task[0],
                'title': task[1],
                'description': task[2],
                'priority': task[3],
                'tags': task[4],
                'date_assigned': task[5],
                'is_completed': task[6]
            })

        return Response({'tasks': task_list}, status=status.HTTP_200_OK)
    



class GetTasksByDateView(APIView):
    def get(self, request):
        authorization_token = request.headers.get("Authorization")

        if not authorization_token:
            return Response({'error': 'Authorization token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = Token.objects.get(key=authorization_token.strip())  # Using simplified token
            user_id = token.user_id
        except Token.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)

        # Get dates from the request body (POST)
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')

        if not start_date or not end_date:
            return Response({'error': 'Start date and end date are required'}, status=status.HTTP_400_BAD_REQUEST)

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, title, description, priority, tags, date_created, is_completed 
                FROM tasks_task 
                WHERE user_id = %s AND date_created BETWEEN %s AND %s
            """, [user_id, start_date, end_date])

            tasks = cursor.fetchall()

        task_list = []
        for task in tasks:
            task_list.append({
                'id': task[0],
                'title': task[1],
                'description': task[2],
                'priority': task[3],
                'tags': task[4],
                'date_created': task[5].strftime("%Y-%m-%d"),
                'is_completed': task[6]
            })

        return Response({'tasks': task_list}, status=status.HTTP_200_OK)

