from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from .models import TrainingInstitute
from .serializers import TrainingInstituteSerializer

class TrainingInstituteProfileView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        try:
            institute = request.user.institute_profile
            serializer = TrainingInstituteSerializer(institute)
            return Response(serializer.data)
        except TrainingInstitute.DoesNotExist:
            return Response({'error': 'Training institute profile not found for this account.'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        try:
            institute = request.user.institute_profile
            serializer = TrainingInstituteSerializer(institute, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except TrainingInstitute.DoesNotExist:
            return Response({'error': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

class TrainingInstituteListView(generics.ListAPIView):
    queryset = TrainingInstitute.objects.all()
    serializer_class = TrainingInstituteSerializer
    permission_classes = (permissions.AllowAny,)
