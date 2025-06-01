# Requirements
* Python 3.11.2

[Crie um ambiente virtual para executar o projeto](https://docs.python.org/pt-br/3/library/venv.html)

Create a virtual environment and install dependencies on Debian:
```bash
sudo apt install python3.11-venv
python3 -m venv <venv_path>
source <venv_path>/bin/activate
pip install -r requirements.txt # after activating
```

---
Para rodar o projeto, escreva 


```bash
pip install -r requirements.txt
cd grafoNaHoraAPI
python manage.py runserver 
```

## Créditos
[Tutorial Django + Angular](https://www.twilio.com/en-us/blog/build-progressive-web-application-django-angular-part-1-backend-api)