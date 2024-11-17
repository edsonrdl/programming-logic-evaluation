import { CalendarAvailability, CalendarEvent, CalendarSlot } from '../types';
import { isSlotAvailableWithBuffer } from '../3-is-slot-available-with-buffer/is-slot-available-with-buffer';



export const listAvailable30MinuteSlots = (
  availability: CalendarAvailability,
  events: Array<CalendarEvent>,
  range: [Date, Date],
): Array<CalendarSlot> => {
  const [startRange, endRange] = range;
  const slots: CalendarSlot[] = [];

  let currentStart = new Date(startRange);

  while (currentStart < endRange) {
    const slot: CalendarSlot = {
      start: new Date(currentStart),
      durationM: 30,
    };


    const dayOfWeek = currentStart.getUTCDay();

    const availableDay = availability.include.find(avail => avail.weekday === dayOfWeek);
    if (availableDay) {
      const [startRange, endRange] = availableDay.range;


      const startAvailability = new Date(currentStart);
      startAvailability.setUTCHours(startRange.hours, startRange.minutes, 0, 0);

      const endAvailability = new Date(currentStart);
      endAvailability.setUTCHours(endRange.hours, endRange.minutes, 0, 0);


      if (slot.start >= startAvailability && (slot.start.getTime() + slot.durationM * 60000) <= endAvailability.getTime()) {
       
        if (isSlotAvailableWithBuffer(availability, events, slot)) {
          slots.push(slot);
        }
      }
    }

    currentStart.setMinutes(currentStart.getMinutes() + 30);
  }

  return slots;
};