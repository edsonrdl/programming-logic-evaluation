
import { CalendarAvailability, CalendarEvent, CalendarSlot, Weekday } from '../types';

export class BaseAvailabilityChecker {
  constructor(private availability: CalendarAvailability) {}

  public isAvailable(slot: CalendarSlot): boolean {
    const slotWeekday = slot.start.getUTCDay(); 
    const slotStartHours = slot.start.getUTCHours();
    const slotStartMinutes = slot.start.getUTCMinutes();
    const slotEndDate = new Date(slot.start.getTime() + slot.durationM * 60000);
    const slotEndHours = slotEndDate.getUTCHours();
    const slotEndMinutes = slotEndDate.getUTCMinutes();

    
    return this.availability.include.some(available => {
      if (available.weekday !== slotWeekday) return false;

      const [startRange, endRange] = available.range;

      const isStartWithinRange =
        slotStartHours > startRange.hours ||
        (slotStartHours === startRange.hours && slotStartMinutes >= startRange.minutes);

      const isEndWithinRange =
        slotEndHours < endRange.hours ||
        (slotEndHours === endRange.hours && slotEndMinutes <= endRange.minutes);

      return isStartWithinRange && isEndWithinRange;
    });
  }
}
