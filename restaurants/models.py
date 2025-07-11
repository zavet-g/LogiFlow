from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Restaurant(models.Model):
    """Модель ресторана"""
    name = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')
    address = models.TextField(verbose_name='Адрес')
    phone = models.CharField(max_length=15, verbose_name='Телефон')
    rating = models.DecimalField(
        max_digits=3, 
        decimal_places=2, 
        default=0.00,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name='Рейтинг'
    )
    delivery_time = models.IntegerField(default=30, verbose_name='Время доставки (мин)')
    min_order = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='Минимальный заказ')
    is_active = models.BooleanField(default=True, verbose_name='Активен')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    
    class Meta:
        verbose_name = 'Ресторан'
        verbose_name_plural = 'Рестораны'
        ordering = ['-rating', 'name']
    
    def __str__(self):
        return self.name


class Category(models.Model):
    """Модель категории блюд"""
    name = models.CharField(max_length=100, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    restaurant = models.ForeignKey(
        Restaurant, 
        on_delete=models.CASCADE, 
        related_name='categories',
        verbose_name='Ресторан'
    )
    
    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"


class Dish(models.Model):
    """Модель блюда"""
    name = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена')
    image = models.ImageField(upload_to='dishes/', blank=True, null=True, verbose_name='Изображение')
    category = models.ForeignKey(
        Category, 
        on_delete=models.CASCADE, 
        related_name='dishes',
        verbose_name='Категория'
    )
    is_available = models.BooleanField(default=True, verbose_name='Доступно')
    preparation_time = models.IntegerField(default=15, verbose_name='Время приготовления (мин)')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    
    class Meta:
        verbose_name = 'Блюдо'
        verbose_name_plural = 'Блюда'
        ordering = ['category', 'name']
    
    def __str__(self):
        return f"{self.category.restaurant.name} - {self.name}" 