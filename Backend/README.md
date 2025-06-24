# Requirements
* Python 3.11.2 (version in Debian 12 repository)

[Crie um ambiente virtual para executar o projeto](https://docs.python.org/pt-br/3/library/venv.html)

Create a virtual environment and install dependencies on Debian 12:
```bash
sudo apt install python3.11-venv
sudo apt install python3-pip

python3 -m venv <venv_path>
source <venv_path>/bin/activate
pip install -r requirements.txt # after activating
```

---
To run the project:
```bash
cd grafoNaHoraAPI
python3 manage.py runserver 
```

## Créditos
[Tutorial Django + Angular](https://www.twilio.com/en-us/blog/build-progressive-web-application-django-angular-part-1-backend-api)