from rest_framework import serializers
from .models import Order, OrderItem
from restaurants.serializers import DishSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    dish = DishSerializer(read_only=True)
    dish_id = serializers.IntegerField(write_only=True)
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'dish', 'dish_id', 'quantity', 'price', 'total_price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer = serializers.ReadOnlyField(source='customer.username')
    restaurant_name = serializers.ReadOnlyField(source='restaurant.name')
    delivery_man = serializers.ReadOnlyField(source='delivery_man.username')
    
    class Meta:
        model = Order
        fields = [
            'id', 'customer', 'restaurant', 'restaurant_name', 'delivery_man',
            'status', 'total_amount', 'delivery_address', 'delivery_phone',
            'special_instructions', 'created_at', 'updated_at', 'items'
        ]
        read_only_fields = ['id', 'total_amount', 'created_at', 'updated_at']


class CreateOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = [
            'restaurant', 'delivery_address', 'delivery_phone',
            'special_instructions', 'items'
        ]
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        
        total_amount = 0
        for item_data in items_data:
            dish_id = item_data.pop('dish_id')
            from restaurants.models import Dish
            dish = Dish.objects.get(id=dish_id)
            item_data['price'] = dish.price
            OrderItem.objects.create(order=order, dish=dish, **item_data)
            total_amount += item_data['price'] * item_data['quantity']
        
        order.total_amount = total_amount
        order.save()
        return order 