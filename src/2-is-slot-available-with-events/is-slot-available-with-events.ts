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