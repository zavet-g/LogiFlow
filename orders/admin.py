from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1
    readonly_fields = ['total_price']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'restaurant', 'status', 'total_amount', 'created_at')
    list_filter = ('status', 'restaurant', 'created_at')
    search_fields = ('customer__username', 'customer__email', 'delivery_address')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [OrderItemInline]
    list_editable = ('status',)
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('customer', 'restaurant', 'delivery_man', 'status')
        }),
        ('Доставка', {
            'fields': ('delivery_address', 'delivery_phone', 'special_instructions')
        }),
        ('Финансы', {
            'fields': ('total_amount',)
        }),
        ('Временные метки', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'dish', 'quantity', 'price', 'total_price')
    list_filter = ('order__restaurant', 'dish__category')
    search_fields = ('order__customer__username', 'dish__name') 