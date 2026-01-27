🎮 Desafio Técnico: Backend Software Engineer (NestJS)

1. Objetivo
O objetivo deste desafio é desenvolver um MVP de um servidor de jogos focado em
Matchmaking. Buscamos avaliar sua proficiência em NestJS, TypeORM, organização de
arquitetura e sua habilidade em escolher estruturas de dados.
🤖 Uso de Inteligência Artificial

Neste desafio, o uso de ferramentas de IA (GitHub Copilot, Claude Code, etc.) é
incentivado. Acreditamos que a IA é uma ferramenta essencial no dia a dia.
Entretanto, o candidato deve ter total domínio sobre o código gerado. Durante a entrevista
técnica, você poderá ser questionado sobre as decisões de arquitetura, o funcionamento
das estruturas de dados escolhidas e a lógica por trás das implementações. Saber "o que"
e "por que" o código está lá é o critério de avaliação, não apenas o código
funcionando.

🚀 Repositório e Entrega
O projeto deve ser hospedado em um repositório público no GitHub. Certifique-se de que o
repositório contenha um arquivo README.md detalhado, incluindo instruções de instalação,
configuração do ambiente (como variáveis .env), como executar a aplicação e os testes.

2. Arquitetura do Projeto
O projeto deve seguir rigorosamente uma arquitetura desacoplada e modular, aplicando os
princípios de Inversão de Dependência (DIP):
● Controller: Responsável pelo roteamento, validação de entrada (DTOs) e resposta
ao cliente.
● Service: Onde reside a lógica de negócio e as regras do matchmaking.
● Repository Abstraction (Interface): Definição do contrato de acesso aos dados.
● Repository Implementation: Implementação concreta utilizando TypeORM.

3. Modelagem de Dados
Implemente as entidades abaixo. Escolha o tipo de Primary Key (PK) que considere mais
adequado. Todas as tabelas devem conter os campos de auditoria do TypeORM: createdAt,
updatedAt e deletedAt
Entidades:
1. Player (Jogador): id, nickname, level (inteiro de 1 a 10).
2. Match (Partida): id, players.
3. Result (Resultado): id, matchId, winnerId, score (string de texto livre).
4. Desafio de Matchmaking
Você deve gerenciar os jogadores que estão "online" e buscar oponentes. O pareamento só
pode ocorrer entre jogadores de mesmo nível. Este matchmaking deve acontecer em
memória.

Interface Obrigatória:
TypeScript
interface MatchmakingService {
/** Adiciona o jogador à lista de espera e tenta encontrar uma partida */
connect(player: Player): void;
/** Remove o jogador da lista de espera (ex: desconexão ou fechamento do app) */
disconnect(player: Player): void;
/** * Busca um oponente do mesmo nível.
* - Se encontrar, retorna o oponente e remove ambos da espera.
* - Se não encontrar, o jogador atual entra na fila.
*/
findMatch(player: Player): Player | null;
}

🌐 Nota de Infraestrutura (Teórica)
No código ou no README.md, adicione um breve comentário descrevendo como você
projetaria essa solução de matchmaking para suportar múltiplas instâncias do serviço e
milhares de jogadores simultâneos.

5. Requisitos Funcionais e Testes
● CRUDs: Operações completas para Player, Match e Result.
● Histórico do Jogador: Endpoint GET /players/:id/matches. Deve retornar as
partidas do jogador com seus respectivos resultados.
● Limpeza de Histórico: Endpoint DELETE /players/:id/matches. Deve remover (soft
delete) todas as partidas e resultados vinculados ao jogador.
● Lista de derrotas(Extra): Endpoint GET /players/:id/matches/lost. para listar todas
as partidas em que o jogador perdeu.
● Testes Unitários: Funções testáveis e execução dos testes.
● Testes de Integração(Extra): Validar o fluxo de persistência e os endpoints
utilizando Testcontainers(https://testcontainers.com/) com PostgreSQL.
● Documentação(Extra): Documente sua API para os desenvolvedores front end
utilizando o swagger.

6. Critérios de Avaliação
1. Qualidade do Código: Nomenclatura, Clean Code e uso correto de DTOs.
2. Domínio do Framework: Uso correto de Providers, Modules e Injeção de
Dependência.
3. Testes: Qualidade e cobertura dos cenários críticos.
4. Git e Versionamento: Boas práticas de commits, organização de branches, pull
requests e fluxo de trabalho.