
# Task 03 - Is slot available with buffer?

## Descrição do Problema

Cada `CalendarEvent` pode opcionalmente ter um buffer, que é um bloco de tempo reservado antes e/ou após o evento em que nenhum outro evento pode ser agendado. Por exemplo, se uma reunião é das 16h às 17h, pode-se bloquear 30 minutos antes para preparação e 1 hora depois para garantir que o tempo esteja livre caso a reunião dure mais que o esperado.

```ts
export type Buffer = {
  /** Pre-event buffer, in minutes */
  before: number;
  /** Post-event buffer, in minutes */
  after: number;
};

export type CalendarEvent = {
  start: Date;
  end: Date;
  buffer?: Buffer; // Buffer Opcional
};
```

## Implementação Completa

```typescript
// src/3-is-slot-available-with-buffer/is-slot-available-with-buffer.ts
import { CalendarAvailability, CalendarEvent, CalendarSlot } from '../types';
import { BaseAvailabilityChecker } from '../2-is-slot-available-with-events/base-availability-checker';

export const isSlotAvailableWithBuffer = (
  availability: CalendarAvailability,
  events: Array<CalendarEvent>,
  slot: CalendarSlot,
): boolean => {
  const baseChecker = new BaseAvailabilityChecker(availability);
  if (!baseChecker.isAvailable(slot)) {
    return false; 
  }

  return !events.some(event => {
    const eventStart = event.start.getTime();
    const eventEnd = event.end.getTime();
    const bufferBefore = event.buffer?.before ?? 0;
    const bufferAfter = event.buffer?.after ?? 0;

    const bufferStart = new Date(eventStart - bufferBefore * 60000).getTime(); 
    const bufferEnd = new Date(eventEnd + bufferAfter * 60000).getTime();

    const slotStart = slot.start.getTime();
    const slotEnd = slotStart + slot.durationM * 60000;

    // Verifica se há sobreposição entre o slot e os buffers de tempo do evento
    return slotStart < bufferEnd && slotEnd > bufferStart;
  });
};
```

## Explicação da Implementação

### Decisões Tomadas

1. **Uso de Verificação de Base**:
   - A verificação inicial da disponibilidade básica é realizada utilizando a `BaseAvailabilityChecker` para garantir que o slot esteja dentro da disponibilidade do médico.

2. **Verificação de Conflito com Buffers**:
   - A função percorre os eventos agendados e verifica se há sobreposição entre o slot desejado e o horário do evento, considerando os buffers definidos.

### Padrões Aplicados

- **Padrão Strategy**:
  - O uso de verificadores base e específicos (para eventos com buffers) segue o padrão Strategy, permitindo que diferentes estratégias de verificação sejam aplicadas sem alterar a função principal.

### Resumo do Fluxo

1. Verificamos se o `CalendarSlot` está disponível na disponibilidade básica utilizando `BaseAvailabilityChecker`.
2. Iteramos sobre os `CalendarEvent`s e verificamos se há conflito entre o slot e os horários dos eventos, levando em consideração os buffers definidos antes e depois dos eventos.
3. Retornamos `true` apenas se não houver sobreposição com nenhum evento, incluindo seus buffers.
