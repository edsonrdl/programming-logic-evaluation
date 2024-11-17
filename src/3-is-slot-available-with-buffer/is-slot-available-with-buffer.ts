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

    
    return slotStart < bufferEnd && slotEnd > bufferStart;
  });
};