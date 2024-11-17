
# Task 02 - Is slot available with events?

## Descrição do Problema

Quando um paciente agenda uma consulta, isso cria um `CalendarEvent`. O evento representa o período em que o médico está ocupado e, portanto, impede que outros eventos ou consultas sejam agendados no mesmo horário. A função `isSlotAvailableWithEvents` precisa determinar se um `CalendarSlot` está disponível ou não, levando em consideração os `CalendarEvent`s que já estão agendados.

```ts
export type CalendarEvent = {
  start: Date;
  end: Date;
  buffer?: Buffer; // Não se preocupe com este buffer nesta tarefa
};
```

## Implementação Completa

```typescript
// src/2-is-slot-available-with-events/is-slot-available-with-events.ts
import { CalendarAvailability, CalendarEvent, CalendarSlot } from '../types';
import { BaseAvailabilityChecker } from './base-availability-checker';
import { EventConflictChecker } from './event-conflict-checker';

export const isSlotAvailableWithEvents = (
  availability: CalendarAvailability,
  events: Array<Omit<CalendarEvent, 'buffer'>>,
  slot: CalendarSlot,
): boolean => {
  const baseChecker = new BaseAvailabilityChecker(availability);
  if (!baseChecker.isAvailable(slot)) {
    return false; 
  }

  const eventChecker = new EventConflictChecker(events);
  if (eventChecker.hasConflict(slot)) {
    return false; 
  }

  return true;
};
```

## Explicação da Implementação

### Decisões Tomadas

1. **Uso de Classes Auxiliares**:
   - A solução utiliza classes auxiliares, `BaseAvailabilityChecker` e `EventConflictChecker`, para verificar a disponibilidade básica e conflitos de eventos. Essa separação de responsabilidades segue o princípio de responsabilidade única (SRP) do SOLID, melhorando a manutenibilidade e a legibilidade do código.
   
2. **Padrão Strategy**:
   - A lógica de verificação de disponibilidade e detecção de conflitos é encapsulada em classes separadas, que agem como estratégias para verificar a disponibilidade. Isso permite que novos tipos de verificadores sejam adicionados facilmente no futuro.

### Classe `EventConflictChecker`

```typescript
// src/2-is-slot-available-with-events/event-conflict-checker.ts
export class EventConflictChecker {
  constructor(private events: Array<Omit<CalendarEvent, 'buffer'>>) {}

  public hasConflict(slot: CalendarSlot): boolean {
    const slotStart = slot.start.getTime();
    const slotEnd = slotStart + slot.durationM * 60000;

    // Verifica se há conflito de horário entre o slot e algum evento existente
    return this.events.some(event => {
      const eventStart = event.start.getTime();
      const eventEnd = event.end.getTime();

      // Verifica se o slot se sobrepõe ao evento
      return slotStart < eventEnd && slotEnd > eventStart;
    });
  }
}
```

### Explicação

1. **Verificação de Conflito de Eventos**:
   - A classe `EventConflictChecker` percorre a lista de eventos e verifica se há sobreposição entre o `CalendarSlot` fornecido e algum evento já existente. Se houver sobreposição, o slot não está disponível.
