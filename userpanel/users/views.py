from django.shortcuts import render

# Create your views here.

import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User, Preference

@csrf_exempt
def post_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data['name']
            email = data['email']
            preferences = [p.strip() for p in data['preferences'].split(',')]
            affiliate = data['affiliate']

            # Validaciones
            if User.objects.filter(name=name).exists() or User.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Usuario duplicado'}, status=400)

            if len(set(preferences)) != len(preferences):
                return JsonResponse({'error': 'Preferencias repetidas'}, status=400)

            pares = [int(p) for p in preferences if int(p) % 2 == 0]
            impares = [int(p) for p in preferences if int(p) % 2 == 1]
            if not pares or not impares:
                return JsonResponse({'error': 'Debe haber al menos una preferencia par y otra impar'}, status=400)

            # Enviar al servidor externo
            response = requests.post("https://invelonjobinterview.herokuapp.com/api/post_test", json=data)
            if response.status_code != 200:
                return JsonResponse({'error': 'Servidor externo falló'}, status=500)

            # Guardar usuario
            user = User.objects.create(name=name, email=email, affiliate=affiliate)
            for p in preferences:
                Preference.objects.create(user=user, name=p)

            return JsonResponse(response.json(), status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def get_users(request):
    if request.method == 'GET':
        users = User.objects.all()
        data = []
        for u in users:
            prefs = sorted([p.name for p in u.preferences.all()])
            data.append({
                'name': u.name,
                'email': u.email,
                'affiliate': u.affiliate,
                'preferences': prefs
            })
        return JsonResponse(data, safe=False)
