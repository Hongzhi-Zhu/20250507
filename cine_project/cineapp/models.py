from django.db import models

# Create your models here.

from django.db import models

class Pelicula(models.Model):
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    duracion_minutos = models.PositiveIntegerField()

    def __str__(self):
        return self.titulo

class Sesion(models.Model):
    pelicula = models.ForeignKey(Pelicula, on_delete=models.CASCADE, related_name='sesiones')
    fecha_hora = models.DateTimeField()
    sala = models.CharField(max_length=50)
    asientos_totales = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.pelicula.titulo} - {self.fecha_hora} - {self.sala}"

class Entrada(models.Model):
    sesion = models.ForeignKey(Sesion, on_delete=models.CASCADE, related_name='entradas')
    asiento_numero = models.PositiveIntegerField()
    comprador_email = models.EmailField(blank=True, null=True)

    class Meta:
        unique_together = ('sesion', 'asiento_numero')

    def __str__(self):
        return f"Entrada {self.asiento_numero} para {self.sesion}"
