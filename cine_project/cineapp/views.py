from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Pelicula, Sesion, Entrada
from .serializers import PeliculaSerializer, SesionSerializer, EntradaSerializer

class PeliculaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Pelicula.objects.all()
    serializer_class = PeliculaSerializer

class SesionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Sesion.objects.all()
    serializer_class = SesionSerializer

class EntradaViewSet(viewsets.ModelViewSet):
    queryset = Entrada.objects.all()
    serializer_class = EntradaSerializer

