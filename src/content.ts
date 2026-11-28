import photoData from './photos.json';

export interface Photo {
  id: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  src: string;
  srcSet: string;
  avifSrcSet?: string;
  position?: string;
}

export const photos = photoData as Photo[];
export const property = {
  name: 'The Basecamp at Bryce',
  location: 'Basye, Virginia · Shenandoah Valley',
  bookingUrl: 'https://airbnb.com/h/thebasecampatbryce',
  parking: 'Plenty of parking for 4–5 cars',
  facts: [
    { value: '8', label: 'guests' },
    { value: '4', label: 'bedrooms' },
    { value: '5', label: 'beds' },
    { value: '3.5', label: 'bathrooms' },
  ],
  checkIn: 'After 4:00 PM',
  checkOut: 'Before 10:00 AM',
};

export const links = { lakeLaura: 'https://bryceresort.com/summer/lake-laura' };

export const navigation = [
  { label: 'The home', href: '#the-home' },
  { label: 'Lake days', href: '#lake-laura' },
  { label: 'Adventure', href: '#adventure' },
  { label: 'Explore nearby', href: '#explore' },
];

export const comforts = [
  { icon: 'coffee', title: 'Your morning, made', text: 'A fully stocked coffee bar. A favorite mug. Nowhere you have to be.' },
  { icon: 'trees', title: 'A little room to breathe', text: 'Screened-in and open-air decks for mountain air and long conversations.' },
  { icon: 'games', title: 'Good times, all together', text: 'A downstairs game room and a woodland-themed play area for little explorers.' },
  { icon: 'home', title: 'Make yourself at home', text: 'A fully equipped kitchen, a cozy fireplace, and space to settle into your own rhythm.' },
] as const;

export const bedrooms = [
  { id: 'bedroom-1', name: 'Bedroom one', bed: '1 king bed', note: 'A restful place to end the day.' },
  { id: 'bedroom-2', name: 'Bedroom two', bed: '1 queen bed', note: 'Sleep in. You’re on mountain time.' },
  { id: 'bedroom-3', name: 'Bedroom three', bed: '1 queen bed + 1 single bed', note: 'A little extra room for your crew.' },
  { id: 'bedroom-4', name: 'Bedroom four', bed: '1 queen bed', note: 'Unpack, unwind, and stay awhile.' },
];

export const activities = [
  { id: 'ski', icon: 'snow', season: 'WINTER DAYS', title: 'Find your mountain legs.', text: 'Ski and snowboard at Bryce Resort, whether you’re finding your first turns or heading back for another run. Then come home to a cozy evening.', linkLabel: 'Skiing at Bryce', url: 'https://bryceresort.com/winter/ski-and-snowboard' },
  { id: 'bike', icon: 'bike', season: 'TRAIL SEASON', title: 'A few more laps. Always.', text: 'Head to Bryce Bike Park for lift-served downhill trails and a day of finding your flow. Explore rentals and lessons through the resort.', linkLabel: 'Explore the bike park', url: 'https://bryceresort.com/summer/bike-park' },
  { id: 'golf', icon: 'golf', season: 'FAIRWAY MORNINGS', title: 'Take the scenic round.', text: 'Tree-lined fairways, mountain scenery, and 18 holes at Bryce. Make a tee time, take your time, and enjoy a different kind of green.', linkLabel: 'Golf at Bryce', url: 'https://bryceresort.com/summer/golf-course' },
] as const;

export const recommendations = [
  { category: 'PIZZA & A PINT', name: 'Pale Fire Brewing', location: 'Basye', text: 'Our family’s go-to for pizza after a day outside, with a local beer for the grown-ups.', url: 'https://www.palefirebrewing.com/basye/', label: 'Visit Pale Fire' },
  { category: 'A DIFFERENT KIND OF ADVENTURE', name: 'Shenandoah Caverns', location: 'Quicksburg', text: 'Head underground for a guided cave tour and a closer look at the Valley’s remarkable formations.', url: 'https://shenandoahcaverns.com/tickets-and-tours/', label: 'Plan a cavern visit' },
  { category: 'SIP & SLOW DOWN', name: 'Cave Ridge Vineyard', location: 'Mount Jackson', text: 'Taste local wines and settle in for a relaxed afternoon in the Shenandoah Valley.', url: 'https://www.caveridge.com/visitus', label: 'Visit the vineyard' },
  { category: 'AN EVENING OUT', name: 'Music in Orkney Springs', location: 'Shrine Mont', text: 'Make a night of an outdoor concert at the Shenandoah Valley Music Festival’s historic mountain venue.', url: 'https://musicfest.org/about/venue/', label: 'Explore the festival' },
];

export const faqs = [
  { question: 'How many people can stay?', answer: 'The home welcomes up to 8 guests, with 4 bedrooms, 5 beds, and 3.5 bathrooms. Sleeping arrangements include one king, three queens, and one single bed.' },
  { question: 'How do we check availability and book?', answer: 'All bookings are made through Airbnb. Use any “Check availability on Airbnb” button to see current dates, the full price for your stay, house rules, and the cancellation policy that applies to your reservation.' },
  { question: 'What are the check-in and checkout times?', answer: `Check-in is ${property.checkIn.toLowerCase()} and checkout is ${property.checkOut.toLowerCase()}. The home offers self check-in with a smart lock. Arrival details are shared through your reservation.` },
  { question: 'Are resort activities and lake access included?', answer: 'Resort activities, lift tickets, tee times, Lake Laura beach access, and equipment rentals are separate offerings unless your reservation explicitly states otherwise. Check Bryce Resort for current access information, seasonal availability, pricing, and reservations.' },
  { question: 'What is the Lake Laura walk like?', answer: 'The loop is approximately 2.5 miles, with wooded stretches and lake views. Bryce describes it as easy to moderate, and it is not wheelchair accessible. Allow time for uneven natural terrain and check trail conditions before you set out.' },
  { question: 'What about Wi-Fi, parking, and laundry?', answer: `The home has Wi-Fi, a dedicated workspace, ${property.parking.toLowerCase()}, a washer and dryer, and air conditioning. You can find the complete, current amenity list and house rules on Airbnb.` },
];

export const soundtrack = {
  title: 'Twilight at Basecamp',
  description: 'A quiet lakeside soundtrack',
  src: './audio/twilight-at-basecamp.mp3',
  credit: 'Original instrumental generated with ElevenLabs Music v2',
} as const;
