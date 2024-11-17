
# Task 04 - List available slots

## Descrição do Problema

Precisamos criar uma função que retorne os slots disponíveis de 30 minutos dentro da disponibilidade (`CalendarAvailability`) de um médico em um intervalo de datas específico. Os slots devem ser verificados em relação a eventos agendados (`CalendarEvent`), incluindo buffers que possam existir antes ou depois desses eventos.

### Estrutura de Tipos

```ts
export type CalendarAvailability = {
  include: Array<{
    weekday: Weekday;
    range: [Time, Time];
  }>;
};

export type CalendarEvent = {
  start: Date;
  end: Date;
  buffer?: Buffer;
};

export type CalendarSlot = {
  start: Date;
  durationM: number;
};
```

## Implementação Completa

```typescript
// src/4-list-available-30-minute-slots/list-available-30-minute-slots.ts
import { CalendarAvailability } from '../types/calendar-availability';
import { CalendarEvent } from '../types/calendar-event';
import { CalendarSlot } from '../types/calendar-slot';
import { isSlotAvailableWithBuffer } from '../3-is-slot-available-with-buffer/is-slot-available-with-buffer';

export const listAvailable30MinuteSlots = (
  availability: CalendarAvailability,
  events: Array<CalendarEvent>,
  range: [Date, Date],
): Array<CalendarSlot> => {
  const [startRange, endRange] = range;
  const slots: CalendarSlot[] = [];

  // Inicializa o ponto de início dos slots
  let currentStart = new Date(startRange);

  while (currentStart < endRange) {
    const slot: CalendarSlot = {
      start: new Date(currentStart),
      durationM: 30,
    };

    // Verifica o dia da semana atual
    const dayOfWeek = currentStart.getUTCDay();

    // Checa se o dia está na disponibilidade do médico
    const availableDay = availability.include.find(avail => avail.weekday === dayOfWeek);
    if (availableDay) {
      const [startRange, endRange] = availableDay.range;

      // Ajusta os horários de disponibilidade
      const startAvailability = new Date(currentStart);
      startAvailability.setUTCHours(startRange.hours, startRange.minutes, 0, 0);

      const endAvailability = new Date(currentStart);
      endAvailability.setUTCHours(endRange.hours, endRange.minutes, 0, 0);

      // Verifica se o slot está dentro do horário disponível
      if (slot.start >= startAvailability && (slot.start.getTime() + slot.durationM * 60000) <= endAvailability.getTime()) {
        // Verifica se há conflitos com eventos utilizando a função `isSlotAvailableWithBuffer`
        if (isSlotAvailableWithBuffer(availability, events, slot)) {
          slots.push(slot); // Slot está disponível
        }
      }
    }

    // Incrementa para o próximo slot de 30 minutos
    currentStart.setMinutes(currentStart.getMinutes() + 30);
  }

  return slots;
};
```

## Explicação da Implementação

### Decisões Tomadas

1. **Geração de Slots de 30 Minutos**:
   - A função gera slots de 30 minutos, começando pelo início do intervalo fornecido (`startRange`) e incrementando em intervalos de 30 minutos até alcançar o final (`endRange`).

2. **Verificação de Disponibilidade**:
   - A função verifica se o dia atual do slot está presente na `CalendarAvailability` e, em caso afirmativo, se o horário do slot cai dentro do intervalo disponível.

3. **Verificação de Conflito com Eventos**:
   - Utilizamos a função `isSlotAvailableWithBuffer` para verificar se o slot não entra em conflito com nenhum `CalendarEvent`, considerando também buffers definidos.

### Padrões Aplicados

- **Padrão Strategy**:
  - Utilizamos a função `isSlotAvailableWithBuffer` para verificar conflitos com eventos, separando essa lógica da verificação de disponibilidade básica. Isso permite que diferentes estratégias de verificação sejam aplicadas conforme necessário.

### Resumo do Fluxo

1. **Geração de Slots**: Geramos slots de 30 minutos dentro do intervalo especificado.
2. **Verificação de Disponibilidade**: Checamos se cada slot está dentro do horário disponível.
3. **Verificação de Conflito com Eventos**: Garantimos que os slots não entrem em conflito com eventos agendados, considerando os buffers.
4. **Adição de Slots Disponíveis**: Se um slot for válido, ele é adicionado à lista de slots disponíveis.
