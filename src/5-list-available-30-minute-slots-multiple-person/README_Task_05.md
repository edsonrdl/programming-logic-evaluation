
# Task 05 - List available slots multiple person

## Descrição do Problema

Para resolver a tarefa `listAvailable30MinuteSlotsMultiplePerson`, precisamos encontrar slots de 30 minutos que estejam disponíveis para todos os médicos em um intervalo de datas especificado. A função deve levar em conta tanto a disponibilidade de cada médico quanto os eventos existentes, incluindo buffers.

## Abordagem para Resolver a Tarefa

1. **Gerar Slots de 30 Minutos** dentro do intervalo de datas fornecido.
2. **Verificar Disponibilidade Combinada**:
   - Para cada slot, verificar se todos os médicos estão disponíveis.
   - Levar em consideração a disponibilidade (`CalendarAvailability`) de cada médico.
   - Excluir slots que entram em conflito com eventos (`CalendarEvent`), incluindo buffers.
3. **Retornar os Slots Disponíveis** que atendem aos critérios para todos os médicos.

## Implementação da Função

**Arquivo**: `src/5-list-available-30-minute-slots-multiple-person/list-available-30-minute-slots-multiple-person.ts`

```typescript
import { CalendarAvailability } from '../types/calendar-availability';
import { CalendarEvent } from '../types/calendar-event';
import { CalendarSlot } from '../types/calendar-slot';
import { listAvailable30MinuteSlots } from '../4-list-available-30-minute-slots/list-available-30-minute-slots';

export const listAvailable30MinuteSlotsMultiplePerson = (
  attendees: Array<{
    availability: CalendarAvailability;
    events: Array<CalendarEvent>;
  }>,
  range: [Date, Date],
): Array<CalendarSlot> => {
  // Gera os slots disponíveis para o primeiro médico
  let commonSlots = listAvailable30MinuteSlots(attendees[0].availability, attendees[0].events, range);

  // Filtra os slots para os outros médicos
  for (let i = 1; i < attendees.length; i++) {
    const doctorSlots = listAvailable30MinuteSlots(attendees[i].availability, attendees[i].events, range);
    // Mantém apenas os slots que estão disponíveis para ambos
    commonSlots = commonSlots.filter(slot => 
      doctorSlots.some(doctorSlot => 
        slot.start.getTime() === doctorSlot.start.getTime() && slot.durationM === doctorSlot.durationM
      )
    );
  }

  return commonSlots;
};
```

## Explicação da Implementação

### Geração de Slots para o Primeiro Médico

- Começamos gerando todos os slots disponíveis para o primeiro médico usando a função `listAvailable30MinuteSlots`.

### Filtragem para os Outros Médicos

- Para cada médico subsequente, geramos seus slots disponíveis.
- Filtramos os slots para manter apenas os que são comuns a todos os médicos (ou seja, os slots que estão disponíveis para todos).

### Comparação de Slots

- Usamos `filter` e `some` para garantir que apenas os slots que são exatamente iguais (mesmo horário de início e duração) sejam mantidos.

## Possíveis Melhoria e Considerações

- **Otimização**: Se houver muitos médicos ou grandes intervalos de datas, essa abordagem pode ser otimizada para evitar verificações redundantes.
- **Casos de Borda**: Certifique-se de que os testes cobrem casos em que não há slots disponíveis ou quando os médicos têm eventos que ocupam quase todo o período.

## Testes Associados

Os testes fornecidos verificam se a função retorna os slots corretos em diferentes cenários:

- **Disponibilidade Combinada para Todos os Médicos**:
  - Os slots devem estar disponíveis para todos os médicos especificados no intervalo fornecido.
- **Conflitos com Eventos e Buffers**:
  - Os slots que conflitam com eventos ou buffers de qualquer médico devem ser excluídos.

## Exemplo de Uso

Com a implementação fornecida, a função `listAvailable30MinuteSlotsMultiplePerson` retorna os slots em que todos os médicos estão disponíveis. Se houver alguma dúvida ou se você deseja ajustar a lógica para atender a outros requisitos, estou à disposição para ajudar!
