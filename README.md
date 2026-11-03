# Painel Financeiro — Ministério de Missões (IDPB)

Painel web que lê o extrato financeiro padrão (.xls / .xlsx / .csv) e gera automaticamente fluxo de caixa, demonstrativo de contribuições, ofertas missionárias, saldos por conta e pontos de atenção.

**Acesse:** o site é publicado pelo GitHub Pages a partir do arquivo `index.html` deste repositório.

Todo o processamento acontece no navegador: a planilha carregada não é enviada para nenhum servidor. O último extrato enviado fica salvo no próprio navegador e continua aparecendo ao reabrir o site, até que um novo arquivo seja enviado (ou até clicar em "Remover dados salvos").

## Compartilhar pelo link

Depois de carregar o extrato, clique em **Publicar no link**. O painel criptografa os dados (AES-256) e grava o arquivo `dados.bin` neste repositório usando um token do GitHub. Esse token precisa ter acesso apenas a este repositório, com a permissão *Contents: Read and write*.

A chave para abrir os dados vai no próprio link, depois de `#k=`. Ela nunca é enviada ao GitHub. Quem tem o link completo vê os relatórios; sem ele, `dados.bin` é ilegível.
