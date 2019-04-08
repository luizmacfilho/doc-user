# DOC-USER

Este projeto foi desenvolvido com o intuito de avaliar o número de comentários realizados por um contribuidor específico. A métrica utilizada foi o número de linhas comentadas por arquivo pelo contribuidor dividido pelo total de linhas comentadas por arquivo

## Modo de usar

Para realizar a busca de documentação por usuário é necessário:
 - clonar o repositório desejado na mesma pasta onde esse repositório se encontra
 - criar um arquivo `SEU_ARQUIVO.js` na raiz deste projeto
 - criar um diretório com o mesmo nome dado ao arquivo `SEU_ARQUIVO.js` no passo anterior
 - copie o conteúdo do arquivo `default.js` para o arquivo criado substituindo as variáveis de acordo com a especificação no próprio arquivo
 - feito isso, basta executar o comando node `SEU_ARQUIVO.js`

## Resultados

Durante a execução do script será criado quatro arquivos:
 - files.json (contendo os arquivos mapeados)
 - range.json (contendo as linhas alteradas pelo usuário configurado em cada arquivo)
 - compare.json (contendo o total de linha com comentário e o total de linha que o usário configurado comentou, por arquivo)
 - calc.json (contendo o número total de linhas comentadas pelo usuário, número total de linhas comentadas nos arquivos que possuem alteração do usuário, percentual de linhas comentadas e total de arquivos que possuem alteraçao do usuário)

## Configurações

Para espeficiar qual tipo de comentário deve ser avaliado em cada arquivo, vá até o arquivo `files.js` e configure no objeto `extensions`.

Para ignorar arquivos, vá até o arquivo `files.js` e configure no array `ignoreFileNames`.

É necessário configurar o token para a API do Github no arquivo `range.js`