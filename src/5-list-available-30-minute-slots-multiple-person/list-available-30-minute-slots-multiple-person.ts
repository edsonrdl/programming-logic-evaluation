import { CalendarAvailability, CalendarEvent, CalendarSlot } from '../types';
import { listAvailable30MinuteSlots } from '../4-list-available-30-minute-slots/list-available-30-minute-slots';



export const listAvailable30MinuteSlotsMultiplePerson = (
  attendees: Array<{
    availability: CalendarAvailability;
    events: Array<CalendarEvent>;
  }>,
  range: [Date, Date],
): Array<CalendarSlot> => {

  let commonSlots = listAvailable30MinuteSlots(attendees[0].availability, attendees[0].events, range);


  for (let i = 1; i < attendees.length; i++) {
    const doctorSlots = listAvailable30MinuteSlots(attendees[i].availability, attendees[i].events, range);
   
    commonSlots = commonSlots.filter(slot => 
      doctorSlots.some(doctorSlot => 
        slot.start.getTime() === doctorSlot.start.getTime() && slot.durationM === doctorSlot.durationM
      )
    );
  }

  return commonSlots;
};