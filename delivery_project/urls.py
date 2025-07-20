"""
URL configuration for delivery_project project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from deliveries.views import api_root

urlpatterns = [
    path('', RedirectView.as_view(url='/api/deliveries/', permanent=False), name='home'),
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api_root'),
    path('api/deliveries/', include('deliveries.urls')),
    path('api/users/', include('users.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/restaurants/', include('restaurants.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) 