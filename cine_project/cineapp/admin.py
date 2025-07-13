from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import Pelicula, Sesion, Entrada

admin.site.register(Pelicula)
admin.site.register(Sesion)
admin.site.register(Entrada)