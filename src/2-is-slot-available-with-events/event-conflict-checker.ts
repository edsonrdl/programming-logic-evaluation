import {  CalendarEvent, CalendarSlot } from '../types';

export class EventConflictChecker {
  constructor(private events: Array<Omit<CalendarEvent, 'buffer'>>) {}

  public hasConflict(slot: CalendarSlot): boolean {
    const slotStart = slot.start.getTime();
    const slotEnd = slotStart + slot.durationM * 60000;

    
    return this.events.some(event => {
      const eventStart = event.start.getTime();
      const eventEnd = event.end.getTime();

      
      return slotStart < eventEnd && slotEnd > eventStart;
    });
  }
}
