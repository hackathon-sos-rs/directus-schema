Hackathon - SOS - RS
====================

O propósito deste repositório é versionar o esquema do Directus. Ele contém um arquivo com o script para baixar a última versão e outro que armazena as versões anteriores.

Como atualizar
--------------

Para fazer o download de uma amostra recente do Directus, use o seguinte comando:

sh

Copy code

`node ./pull_directus_schema.js`

Certifique-se de ter a variável `DIRECTUS_ROOT_TOKEN` configurada no seu ambiente. Esta variável representa o token de autenticação necessário para acessar a API do Directus.

Restaurando o esquema
---------------------

Para restaurar a partir de uma amostra recente do Directus, use o seguinte comando:

sh

Copy code

`node ./push_directus_schema.js ./schemas/<schema_id>.json https://<host>:<port>`

Certifique-se de ter a variável `DIRECTUS_DEST_ROOT_TOKEN` configurada no seu ambiente. Esta variável representa o token de autenticação necessário para acessar o destino onde o esquema será restaurado.

Explicação das Variáveis de Ambiente
------------------------------------

-   `DIRECTUS_ROOT_TOKEN`: Token de autenticação para acessar a API do Directus. Esse token é necessário para baixar o esquema atual.
-   `DIRECTUS_DEST_ROOT_TOKEN`: Token de autenticação para acessar o destino onde o esquema será restaurado. Esse token é necessário para garantir que você tem permissão para enviar o esquema ao servidor de destino.