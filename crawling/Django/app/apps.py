from django.apps import AppConfig

class appConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'

    #ready method override
    def ready(self):
        from app.models import Economy

        #실행 시 데이터 초기화
        Economy.objects.all().delete()