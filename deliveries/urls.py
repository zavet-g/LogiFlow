from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DeliveryViewSet, 
    report_view, 
    login_page_view,
    login_view, 
    logout_view, 
    delivery_data_api
)

router = DefaultRouter()
router.register(r'deliveries', DeliveryViewSet, basename='delivery')

urlpatterns = [
    path('', include(router.urls)),
    path('', login_page_view, name='login_page'),
    path('report/', report_view, name='report'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('api/delivery-data/', delivery_data_api, name='delivery_data_api'),
] 