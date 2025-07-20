from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
import json
from datetime import datetime, timedelta
from .models import Delivery, TransportModel, Service, CargoType, DeliveryStatus
from .serializers import DeliverySerializer

# Create your views here.

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """Корневой API endpoint"""
    return Response({
        'message': 'LogiFlow API',
        'version': '1.0.0',
        'endpoints': {
            'deliveries': '/api/deliveries/',
            'users': '/api/users/',
            'orders': '/api/orders/',
            'restaurants': '/api/restaurants/',
            'admin': '/admin/',
        }
    })

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

def login_page_view(request):
    """Страница авторизации"""
    if request.user.is_authenticated:
        return redirect('report')
    return render(request, 'deliveries/login.html')

@login_required
def report_view(request):
    """Главная страница отчета по доставкам"""
    # Получаем параметры фильтрации
    date_from = request.GET.get('date_from')
    date_to = request.GET.get('date_to')
    service_id = request.GET.get('service')
    cargo_type_id = request.GET.get('cargo_type')
    status_id = request.GET.get('status')
    
    # Базовый queryset
    deliveries = Delivery.objects.all()
    
    # Применяем фильтры
    if date_from:
        deliveries = deliveries.filter(delivery_time__date__gte=date_from)
    if date_to:
        deliveries = deliveries.filter(delivery_time__date__lte=date_to)
    if service_id:
        deliveries = deliveries.filter(service_id=service_id)
    if cargo_type_id:
        deliveries = deliveries.filter(cargo_type_id=cargo_type_id)
    if status_id:
        deliveries = deliveries.filter(status_id=status_id)
    
    # Получаем справочники для фильтров
    services = Service.objects.all()
    cargo_types = CargoType.objects.all()
    statuses = DeliveryStatus.objects.all()
    
    # Подготавливаем данные для графика (группировка по дням)
    chart_data = []
    if deliveries.exists():
        # Группируем доставки по дням
        from django.db.models import Count
        from django.db.models.functions import TruncDate
        
        daily_deliveries = deliveries.annotate(
            date=TruncDate('delivery_time')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')
        
        for item in daily_deliveries:
            chart_data.append({
                'date': item['date'].strftime('%d.%m'),
                'count': item['count']
            })
    
    # Если нет данных для графика, создаем тестовые данные
    if not chart_data:
        chart_data = [
            {'date': '01.01', 'count': 3},
            {'date': '02.01', 'count': 5},
            {'date': '03.01', 'count': 2},
            {'date': '04.01', 'count': 7},
            {'date': '05.01', 'count': 4},
            {'date': '06.01', 'count': 6},
            {'date': '07.01', 'count': 3},
            {'date': '08.01', 'count': 8},
            {'date': '09.01', 'count': 5},
            {'date': '10.01', 'count': 4}
        ]
    
    context = {
        'deliveries': deliveries,
        'services': services,
        'cargo_types': cargo_types,
        'statuses': statuses,
        'chart_data': chart_data,
        'chart_data_json': json.dumps(chart_data),  # Добавляем JSON версию
        'filters': {
            'date_from': date_from,
            'date_to': date_to,
            'service': service_id,
            'cargo_type': cargo_type_id,
            'status': status_id,
        }
    }
    
    return render(request, 'deliveries/report.html', context)

@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    """API для авторизации"""
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return JsonResponse({'error': 'Необходимы логин и пароль'}, status=400)
        
        user = authenticate(username=username, password=password)
        if user is not None:
            auth_login(request, user)
            return JsonResponse({
                'success': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            })
        else:
            return JsonResponse({'error': 'Неверный логин или пароль'}, status=401)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Неверный формат данных'}, status=400)
    except Exception as e:
        return JsonResponse({'error': 'Ошибка сервера'}, status=500)

def logout_view(request):
    """Выход из системы"""
    auth_logout(request)
    return JsonResponse({'success': True})

@api_view(['GET'])
@permission_classes([AllowAny])
def delivery_data_api(request):
    """API для получения данных доставок для React компонентов"""
    # Получаем параметры фильтрации
    date_from = request.GET.get('date_from')
    date_to = request.GET.get('date_to')
    service_id = request.GET.get('service')
    cargo_type_id = request.GET.get('cargo_type')
    status_id = request.GET.get('status')
    
    # Базовый queryset
    deliveries = Delivery.objects.select_related(
        'transport_model', 'service', 'cargo_type', 'status'
    ).all()
    
    # Применяем фильтры
    if date_from:
        deliveries = deliveries.filter(delivery_time__date__gte=date_from)
    if date_to:
        deliveries = deliveries.filter(delivery_time__date__lte=date_to)
    if service_id:
        deliveries = deliveries.filter(service_id=service_id)
    if cargo_type_id:
        deliveries = deliveries.filter(cargo_type_id=cargo_type_id)
    if status_id:
        deliveries = deliveries.filter(status_id=status_id)
    
    # Сериализуем данные
    serializer = DeliverySerializer(deliveries, many=True)
    return Response(serializer.data)
