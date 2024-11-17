# README - Padrões Utilizados e Pontos de Aplicação nas Tarefas

## 1. Task 01 - Is Slot Available

### Padrões Utilizados:
- **Encapsulamento**: Toda a lógica para verificar a disponibilidade de um slot está encapsulada na função `isSlotAvailable`, tornando-a fácil de entender, testar e reutilizar.
- **Strategy Pattern (Padrão Estratégia)**: A lógica de verificação da disponibilidade foi tratada com verificações condicionais que podem ser adaptadas ou substituídas para lidar com diferentes regras de disponibilidade sem alterar o núcleo da função.

### Pontos de Aplicação:
- O método `isSlotAvailable` utiliza lógica encapsulada para verificar a disponibilidade com base na `CalendarAvailability` fornecida. Isso promove uma separação clara entre a definição de disponibilidade e a lógica de verificação.

---

## 2. Task 02 - Is Slot Available with Events

### Padrões Utilizados:
- **Strategy Pattern (Padrão Estratégia)**: A implementação faz uso de verificadores separados para disponibilidade básica e eventos, permitindo que a função principal `isSlotAvailableWithEvents` delegue verificações específicas para verificadores especializados.
- **Encapsulamento**: A lógica de verificação de conflitos de eventos é encapsulada em uma classe separada (`EventConflictChecker`), promovendo a reutilização e facilitando a manutenção.

### Pontos de Aplicação:
- `BaseAvailabilityChecker` e `EventConflictChecker` foram usados para separar a lógica de verificação de disponibilidade básica da verificação de conflitos de eventos, aplicando o padrão Strategy para diferentes cenários de validação.

---

## 3. Task 03 - Is Slot Available with Buffer

### Padrões Utilizados:
- **Strategy Pattern (Padrão Estratégia)**: A abordagem segue a mesma linha do Task 02, com verificadores específicos para disponibilidade básica e para conflitos com buffers.
- **Encapsulamento**: A função `isSlotAvailableWithBuffer` encapsula a lógica para lidar com buffers antes e depois dos eventos, mantendo a responsabilidade única de verificar conflitos com base em buffers.

### Pontos de Aplicação:
- `BaseAvailabilityChecker` foi utilizado para verificar a disponibilidade inicial do slot.
- A verificação de buffers é realizada separadamente dentro da função `isSlotAvailableWithBuffer`, verificando conflitos de tempo de forma encapsulada.

---

## 4. Task 04 - List Available 30-Minute Slots

### Padrões Utilizados:
- **Iterator Pattern (Padrão Iterador)**: A função percorre o intervalo de tempo fornecido, gerando slots de 30 minutos iterativamente.
- **Strategy Pattern (Padrão Estratégia)**: A função utiliza `isSlotAvailableWithBuffer` como estratégia para verificar a disponibilidade de cada slot gerado.
- **Encapsulamento**: A lógica de geração de slots de 30 minutos e sua verificação com disponibilidade e buffers são mantidas encapsuladas dentro da função.

### Pontos de Aplicação:
- A lógica de geração de slots iterativamente usa um loop para criar intervalos de 30 minutos.
- O uso da função `isSlotAvailableWithBuffer` para validação de slots mantém a lógica modular e baseada em estratégias específicas.

---

## 5. Task 05 - List Available Slots Multiple Person

### Padrões Utilizados:
- **Composite Pattern (Padrão Composto)**: A função combina as disponibilidades de vários médicos, verificando slots comuns entre eles.
- **Iterator Pattern (Padrão Iterador)**: O loop percorre todos os médicos para gerar e verificar slots disponíveis.
- **Strategy Pattern (Padrão Estratégia)**: Utiliza `listAvailable30MinuteSlots` como estratégia para verificar os slots disponíveis para cada médico e combina os resultados.

### Pontos de Aplicação:
- A função começa gerando slots para o primeiro médico e então filtra slots para cada médico subsequente, combinando os resultados para encontrar slots disponíveis para todos.
- O uso do `listAvailable30MinuteSlots` como subcomponente mostra a aplicação do padrão composto, pois combina várias verificações em uma única operação.

---

## Considerações Finais

Esses padrões foram escolhidos para proporcionar modularidade, reutilização de código e fácil manutenção, permitindo que as regras de disponibilidade, eventos e buffers possam ser alteradas ou expandidas sem grandes mudanças no núcleo das funções. Se desejar detalhes ou exemplos adicionais, estou à disposição para explicar!
