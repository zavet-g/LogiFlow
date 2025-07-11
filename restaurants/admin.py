from django.contrib import admin
from .models import Restaurant, Category, Dish


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'phone', 'rating', 'delivery_time', 'min_order', 'is_active')
    list_filter = ('is_active', 'rating')
    search_fields = ('name', 'address', 'phone')
    list_editable = ('is_active',)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'restaurant', 'description')
    list_filter = ('restaurant',)
    search_fields = ('name', 'restaurant__name')


@admin.register(Dish)
class DishAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'is_available', 'preparation_time')
    list_filter = ('category__restaurant', 'category', 'is_available')
    search_fields = ('name', 'category__name', 'category__restaurant__name')
    list_editable = ('price', 'is_available') 