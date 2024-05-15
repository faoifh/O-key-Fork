@echo off
pushd "%~dp0\Django"
python manage.py runserver
popd