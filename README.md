# Steam Badge Viewer

O Steam Badge Viewer é um site que permite aos usuários visualizar suas badges completas, calcular seu nível na Steam e verificar os preços das badges da Steam. Com esta ferramenta, os jogadores da Steam podem ter uma visão rápida e conveniente de suas conquistas e progresso.

## Conteúdo

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Uso](#uso)
- [Layout](#layout)
- [Demo](#demo)
- [Créditos](#créditos)

## Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as seguintes tecnologias e recursos:

- HTML
- JavaScript
- CSS
- Python
- Flask [(Documentação)](https://flask.palletsprojects.com/en/3.0.x/)
- Steam API [(Documentação)](https://steamcommunity.com/dev)
- Material Icons do Google [(Documentação)](https://fonts.google.com/icons)

## Instalação

Para instalar e configurar o projeto, siga estas etapas:

1. Clone o repositório:
   
```shell
git clone https://github.com/cristoferluch/Steam-Badge-Viewer.git
cd Steam-Badge-Viewer
npm install
````

2. Crie um arquivo .env na raiz do projeto e adicione a sua chave da API da Steam com a seguinte estrutura:
   
````shell
STEAM_API_KEY="sua chave"
````
Certifique-se de substituir "sua chave" pela sua chave de API da Steam. Se você ainda não tem uma chave da API, você pode obtê-la [aqui](https://steamcommunity.com/dev/apikey).

2. Instale as dependências do Python usando pip:

````shel
pip install -r requirements.txt
````

3. Inicie o servidor Flask:
````shell
python app.py
````

## Uso
O Steam Badge Viewer oferece as seguintes funcionalidades:

- Visualização de Badges do usuário
- Cálculo do Nível da Steam
- Verificação de Preços de Badges da Steam

Acesse o site clicando [aqui](https://steam-badge-viewer.onrender.com)

## Layout

<p align="center">
   <img src="https://github.com/cristoferluch/assets/blob/main/steam-badge-viewer-01-v2.png" alt="#01" width="600">
</p>

<p align="center">
   <img src="https://github.com/cristoferluch/assets/blob/main/steam-badge-viewer-02-v2.png" alt="#02" width="600">
</p>

<p align="center">
   <img src="https://github.com/cristoferluch/assets/blob/main/steam-badge-viewer-03-v2.png" alt="#03" width="600">
</p>

## Demo 

[Youtube](https://youtu.be/KXOhuHgURwU)

## Créditos
Gostaria de agradecer ao [Steam Card Exchange](https://www.steamcardexchange.net) por fornecer a API tambem utilizada neste projeto.
