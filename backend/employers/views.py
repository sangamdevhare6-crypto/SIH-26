from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from .models import Employer
from .serializers import EmployerSerializer

class EmployerProfileView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        try:
            employer = request.user.employer_profile
            serializer = EmployerSerializer(employer)
            return Response(serializer.data)
        except Employer.DoesNotExist:
            return Response({'error': 'Employer profile not found.'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        try:
            employer = request.user.employer_profile
            serializer = EmployerSerializer(employer, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Employer.DoesNotExist:
            return Response({'error': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

class EmployerListView(generics.ListAPIView):
    queryset = Employer.objects.all()
    serializer_class = EmployerSerializer
    permission_classes = (permissions.AllowAny,)
