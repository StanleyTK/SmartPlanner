# tasks/views.py

from django.db import connection
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import Task
from tags.models import Tag
import json


class CreateTaskView(APIView):
    def post(self, request):
        """
        Handles POST requests to create a new task for the authenticated user.
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

        title = data.get('title')
        description = data.get('description', '')
        priority = data.get('priority', 2)
        tag_id = data.get('tag_id', None)
        date_created = data.get('date_created')

        if not (title and date_created):
            return Response({'error': 'Title and date_created are required'}, status=status.HTTP_400_BAD_REQUEST)

        tag = None
        if tag_id:
            try:
                tag = Tag.objects.get(id=tag_id, user_id=user_id)
            except Tag.DoesNotExist:
                return Response({'error': 'Invalid tag ID'}, status=status.HTTP_400_BAD_REQUEST)

        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO tasks_task (title, user_id, description, priority, tag_id, date_created, is_completed)
                VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id
            """, [title, user_id, description, priority, tag.id if tag else None, date_created, False])
            
            task_id = cursor.fetchone()[0]

        return Response({'message': 'Task created successfully', 'task_id': task_id}, status=status.HTTP_201_CREATED)


class UpdateTaskView(APIView):
    def post(self, request):
        """
        Handles POST requests to update a task for the authenticated user.
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

        task_id = data.get('task_id')
        if not task_id:
            return Response({'error': 'Task ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        tag_id = data.get('tag_id', None)

        if tag_id:
            try:
                tag = Tag.objects.get(id=tag_id, user_id=user_id)
            except Tag.DoesNotExist:
                return Response({'error': 'Invalid tag ID'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            tag = None

        with connection.cursor() as cursor:
            # Update title if provided
            if 'title' in data:
                cursor.execute(
                    "UPDATE tasks_task SET title = %s WHERE id = %s AND user_id = %s",
                    [data['title'], task_id, user_id]
                )
            # Update description if provided
            if 'description' in data:
                cursor.execute(
                    "UPDATE tasks_task SET description = %s WHERE id = %s AND user_id = %s",
                    [data['description'], task_id, user_id]
                )
            # Update priority if provided
            if 'priority' in data:
                cursor.execute(
                    "UPDATE tasks_task SET priority = %s WHERE id = %s AND user_id = %s",
                    [data['priority'], task_id, user_id]
                )
            # Update tag_id if provided
            if 'tag_id' in data:
                cursor.execute(
                    "UPDATE tasks_task SET tag_id = %s WHERE id = %s AND user_id = %s",
                    [tag.id if tag else None, task_id, user_id]
                )
            # Update is_completed if provided
            if 'is_completed' in data:
                cursor.execute(
                    "UPDATE tasks_task SET is_completed = %s WHERE id = %s AND user_id = %s",
                    [data['is_completed'], task_id, user_id]
                )

        return Response({'message': 'Task updated successfully'}, status=status.HTTP_200_OK)


class DeleteTaskView(APIView):
    def delete(self, request):
        """
        Handles DELETE requests to delete a task for the authenticated user.
        """
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
            cursor.execute(
                "DELETE FROM tasks_task WHERE id = %s AND user_id = %s",
                [task_id, user_id]
            )

        return Response({'message': 'Task deleted successfully'}, status=status.HTTP_200_OK)


class GetTasksView(APIView):
    def get(self, request):
        """
        Handles GET requests to retrieve all tasks for the authenticated user.
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
            cursor.execute("""
                SELECT t.id, t.title, t.description, t.priority, 
                       tg.id AS tag_id, tg.name AS tag_name, 
                       t.date_created, t.is_completed 
                FROM tasks_task t
                LEFT JOIN tags_tag tg ON t.tag_id = tg.id
                WHERE t.user_id = %s
            """, [user_id])
            tasks = cursor.fetchall()

        task_list = []
        for task in tasks:
            task_list.append({
                'id': task[0],
                'title': task[1],
                'description': task[2],
                'priority': task[3],
                'tag_id': task[4], 
                'tag_name': task[5] or "No Tag",
                'date_created': task[6].strftime("%Y-%m-%d"),
                'is_completed': task[7]
            })

        return Response({'tasks': task_list}, status=status.HTTP_200_OK)


class GetTasksByDateView(APIView):
    def post(self, request):
        """
        Handles POST requests to retrieve tasks for the authenticated user by date range.


        """
        authorization_token = request.headers.get("Authorization")

        if not authorization_token:
            return Response({'error': 'Authorization token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = Token.objects.get(key=authorization_token.strip())
            user_id = token.user_id
        except Token.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)

        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')

        if not start_date or not end_date:
            return Response({'error': 'Start date and end date are required'}, status=status.HTTP_400_BAD_REQUEST)

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT t.id, t.title, t.description, t.priority, 
                       tg.id AS tag_id, tg.name AS tag_name, 
                       t.date_created, t.is_completed 
                FROM tasks_task t
                LEFT JOIN tags_tag tg ON t.tag_id = tg.id
                WHERE t.user_id = %s AND t.date_created BETWEEN %s AND %s
            """, [user_id, start_date, end_date])

            tasks = cursor.fetchall()

        task_list = []
        for task in tasks:
            task_list.append({
                'id': task[0],
                'title': task[1],
                'description': task[2],
                'priority': task[3],
                'tag_id': task[4],
                'tag_name': task[5] or "No Tag",
                'date_created': task[6].strftime("%Y-%m-%d"),
                'is_completed': task[7]
            })

        return Response({'tasks': task_list}, status=status.HTTP_200_OK)


class FilterTasksView(APIView):
    def post(self, request):

        """
        Handles POST requests to filter tasks for the authenticated user based on 
        criteria.
        """
        authorization_token = request.headers.get("Authorization")
        
        if not authorization_token:
            return Response({'error': 'Authorization token is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            token = Token.objects.get(key=authorization_token)
            user_id = token.user_id
        except Token.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)
        
        data = request.data
        tags = data.get('tags', [])  # Expecting list of tag IDs
        start_date = data.get('start_date')  # Start date for range
        end_date = data.get('end_date')      # End date for range
        completed = data.get('completed', 'all')  # 'true', 'false', 'all'
        priority = data.get('priority')  # 'low', 'medium', 'high'
        
        query = """
            SELECT t.id, t.title, t.description, t.priority, 
                   tg.id AS tag_id, tg.name AS tag_name, 
                   t.date_created, t.is_completed 
            FROM tasks_task t
            LEFT JOIN tags_tag tg ON t.tag_id = tg.id
            WHERE t.user_id = %s
        """
        params = [user_id]
        
        if tags:
            if not isinstance(tags, list):
                return Response({'error': 'Tags must be a list of tag IDs.'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                tag_ids = [int(tag_id) for tag_id in tags]
            except ValueError:
                return Response({'error': 'Invalid tag IDs provided.'}, status=status.HTTP_400_BAD_REQUEST)
            
            placeholders = ','.join(['%s'] * len(tag_ids))
            query += f" AND t.tag_id IN ({placeholders})"
            params.extend(tag_ids)
        


        if start_date and end_date:
            query += " AND t.date_created BETWEEN %s AND %s"
            params.extend([start_date, end_date])
        elif start_date and not end_date:
            query += " AND t.date_created >= %s"
            params.append(start_date)
        elif not start_date and end_date:
            query += " AND t.date_created <= %s"
            params.append(end_date)
        
        if completed.lower() == 'true':
            query += " AND t.is_completed = TRUE"
        elif completed.lower() == 'false':
            query += " AND t.is_completed = FALSE"
        
        if priority:
            priority_mapping = {
                'low': 1,
                'medium': 2,
                'high': 3
            }
            priority_value = priority.lower()
            if priority_value not in priority_mapping:
                return Response({'error': 'Invalid priority value.'}, status=status.HTTP_400_BAD_REQUEST)
            query += " AND t.priority = %s"
            params.append(priority_mapping[priority_value])
        
        query += " ORDER BY t.date_created ASC"
        
        with connection.cursor() as cursor:
            cursor.execute(query, params)
            tasks = cursor.fetchall()
        
        task_list = []
        for task in tasks:
            task_list.append({
                'id': task[0],
                'title': task[1],
                'description': task[2],
                'priority': dict(Task.PRIORITY_CHOICES).get(task[3], 'Unknown'),
                'tag_id': task[4],
                'tag_name': task[5] or "No Tag",
                'date_created': task[6].strftime("%Y-%m-%d"),
                'is_completed': task[7]
            })
        
        return Response({'tasks': task_list}, status=status.HTTP_200_OK)
