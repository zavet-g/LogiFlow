from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'phone', 'is_delivery_man', 'is_staff')
    list_filter = ('is_delivery_man', 'is_staff', 'is_superuser', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Доставка', {'fields': ('phone', 'address', 'is_delivery_man')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Доставка', {'fields': ('phone', 'address', 'is_delivery_man')}),
    ) 