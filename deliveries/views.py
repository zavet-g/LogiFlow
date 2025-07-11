from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Delivery
from .serializers import DeliverySerializer

# Create your views here.

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
