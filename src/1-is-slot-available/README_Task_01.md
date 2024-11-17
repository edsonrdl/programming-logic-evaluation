
# Task 01 - Is slot available?

Doctors have a `CalendarAvailability`, which is a definition of when they are available on a weekly basis (eg. Monday–Friday 9am–5pm). The data structure is in `src/types/calendar-availability`:

```ts
export type CalendarAvailability = {
  include: Array<{
    weekday: Weekday;
    range: [Time, Time];
  }>;
};
```

To schedule a consultation, patients must select a `CalendarSlot` (eg. January 15th 2024, Monday 3pm). The data structure is in `src/types/calendar-slot`:

```ts
export type CalendarSlot = {
  start: Date;
  /** The duration of the time slot, in minutes. */
  durationM: number;
};
```

In the `src/1-is-slot-available/is-slot-available.ts` file, you need to implement a function that determines if a given `CalendarSlot` is available for the given `CalendarAvailability`. For example:

```ts
// Every Tuesday 9:00—20:00
const availability: CalendarAvailability = {
  include: [
    {
      weekday: Weekday.tuesday,
      range: [
        { hours: 9, minutes: 0 },
        { hours: 20, minutes: 0 }
      ]
    }
  ]
};

// January 16th 2024, Tuesday 21:00—21:30
const slot: CalendarSlot = {
  start: new Date(`2024-01-16T21:00`), // January 16th 2024, Tuesday 21:00
  durationM: 30 // 30 minutes
};

isSlotAvailable(availability, slot);
//=> Should return `false` because the doctor is not available Tuesday 21:00–21:30
```

You can also look at the tests to see more examples of how the function should behave.

---

## Implementação Completa

```typescript
// src/1-is-slot-available/is-slot-available.ts
import { CalendarAvailability } from '../types/calendar-availability';
import { CalendarSlot } from '../types/calendar-slot';

export const isSlotAvailable = (availability: CalendarAvailability, slot: CalendarSlot): boolean => {
  // Extrai o dia da semana do slot (0 = domingo, 1 = segunda, ..., 6 = sábado)
  const slotWeekday = slot.start.getUTCDay();
  const slotStartHours = slot.start.getUTCHours();
  const slotStartMinutes = slot.start.getUTCMinutes();
  const slotEndDate = new Date(slot.start.getTime() + slot.durationM * 60000); // Calcula a data/hora de término
  const slotEndHours = slotEndDate.getUTCHours();
  const slotEndMinutes = slotEndDate.getUTCMinutes();

  // Verifica se o slot está disponível com base na disponibilidade fornecida
  return availability.include.some(available => {
    // Verifica se o dia da semana da disponibilidade corresponde ao dia do slot
    if (available.weekday !== slotWeekday) return false;

    const [startRange, endRange] = available.range;

    // Verifica se o horário inicial do slot está dentro do intervalo permitido
    const isStartWithinRange =
      slotStartHours > startRange.hours ||
      (slotStartHours === startRange.hours && slotStartMinutes >= startRange.minutes);

    // Verifica se o horário final do slot está dentro do intervalo permitido
    const isEndWithinRange =
      slotEndHours < endRange.hours ||
      (slotEndHours === endRange.hours && slotEndMinutes <= endRange.minutes);

    // O slot é considerado disponível apenas se o horário de início e de término estiverem dentro do intervalo permitido
    return isStartWithinRange && isEndWithinRange;
  });
};
```

## Explicação

### Extração de Dados do Slot

- **`slotWeekday`**: Obtemos o dia da semana do slot usando `getUTCDay()`.
- **`slotStartHours`** e **`slotStartMinutes`**: Obtém as horas e minutos do horário de início do slot.
- **`slotEndDate`**: Calculamos a data/hora de término somando a duração (em minutos) ao horário de início do slot.
- **`slotEndHours`** e **`slotEndMinutes`**: Obtém as horas e minutos do horário de término.

### Verificação de Disponibilidade

- Usamos `some()` para iterar sobre as disponibilidades (`availability.include`) e verificar se há uma disponibilidade que corresponda ao dia da semana do slot.
- Verificamos se o horário de início do slot está dentro do intervalo permitido (`isStartWithinRange`).
- Verificamos se o horário de término do slot está dentro do intervalo permitido (`isEndWithinRange`).
- Retornamos `true` apenas se ambos os horários estiverem dentro do intervalo permitido.

---

### Resumo

- **Mantém a Estrutura**: A função mantém exatamente a estrutura fornecida, sem alterações na assinatura ou no nome.
- **Lógica Simples e Direta**: A lógica está encapsulada em verificações claras, garantindo que um `CalendarSlot` seja verificado com base no `CalendarAvailability`.
- **Fácil Manutenção**: Caso novas condições de verificação sejam necessárias, a estrutura pode ser expandida sem modificar a função principal `isSlotAvailable`.
