from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PeliculaViewSet, SesionViewSet, EntradaViewSet

router = DefaultRouter()
router.register('peliculas', PeliculaViewSet)
router.register('sesiones', SesionViewSet)
router.register('entradas', EntradaViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
