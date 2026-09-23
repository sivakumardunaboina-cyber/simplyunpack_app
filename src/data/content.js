// Static content. Prices and add-on quotes marked (MOCK) are placeholders — replace with real data or API responses.

export const SERVICES = [
  {"id":"prepack","name":"Pre-pack","kind":"Core service","addon":false,"img":"/assets/prepack.png","alt":"Simply Unpack crew wrapping a vase in honeycomb paper","blurb":"Valuables, documents and fragile items packed first, every room labelled.","foot":"Days before the move","price":"In every package","covers":"Your current home","long":"A few days before moving day, the crew packs what matters most — valuables, documents, fragile décor and daily-use essentials — and labels every room so nothing goes missing on the day.","included":["Valuables and documents packed and sealed","Fragile items wrapped in honeycomb paper","Room-by-room labelling and inventory","An essentials box for the first night","A declutter pass on what not to move"]},
  {"id":"movers","name":"Packers & movers","kind":"Core service","addon":false,"img":"/assets/movers-truck.png","alt":"Simply Unpack crew loading a branded truck","blurb":"Packing, loading, transport and room-wise delivery across Bengaluru.","foot":"Moving day · live tracking","price":"In every package","covers":"Both homes","long":"Everything else is packed into reusable branded crates, loaded, moved across Bengaluru and placed room-wise at the new home. You can follow the truck live.","included":["Every room packed into labelled crates","Furniture wrapped, dismantled where needed","Loading, transport and unloading","Room-wise placement at the new home","Live truck tracking on moving day"]},
  {"id":"unpack","name":"Unpacking","kind":"Core service","addon":false,"img":"/assets/unpack-setup.png","alt":"Simply Unpack team unpacking and arranging a new home","blurb":"Every carton emptied into the right room, packing waste gone.","foot":"Same day as the move","price":"In every package","covers":"Every room","long":"Unpacking starts as the crates land. Surfaces are wiped before anything goes in, every carton is emptied into the right room, and the packing waste leaves with the crew.","included":["Surfaces cleaned before anything is put away","Every carton opened, emptied and cleared","Contents placed in the right room","Cartons and packing waste taken away"]},
  {"id":"kitchen","name":"Kitchen setup","kind":"Core service","addon":false,"img":"/assets/unpack-setup.png","alt":"Simply Unpack crew arranging a kitchen","blurb":"Cabinets zoned around how you cook, utensils washed, pantry sorted.","foot":"Usable by dinner","price":"In every package","covers":"Kitchen & pantry","long":"The room that decides whether a house feels moved into. Cabinets are zoned around the stove and sink, utensils washed and arranged, and the pantry sorted and labelled.","included":["Utensils and crockery washed and arranged","Cabinets zoned around the stove and sink","Pantry sorted and labelled","Appliances placed and plugged in"]},
  {"id":"wardrobe","name":"Wardrobe setup","kind":"Core service","addon":false,"img":"/assets/wardrobe.png","alt":"Simply Unpack crew member hanging ethnic wear in a garment bag","blurb":"Clothes hung by category and daily use, delicate wear bagged.","foot":"Every bedroom","price":"In every package","covers":"Wardrobes & closets","long":"Wardrobe crates are emptied the same day. Clothes are hung by category and daily use, delicate and ethnic wear goes into garment bags, and folded items go into drawers.","included":["Clothes hung by category and daily use","Delicate and ethnic wear in garment bags","Folded items and linen in drawers","Shoes and bags shelved"]},
  {"id":"organise","name":"Home organising","kind":"Core service","addon":false,"img":"/assets/organise.png","alt":"Simply Unpack crew arranging shelves in a living room","blurb":"Living room, bedrooms, bathrooms and storage set up to live in.","foot":"Move-in ready","price":"In every package","covers":"Whole home","long":"The last pass that makes it feel like home: books and décor on shelves, bathrooms stocked, storage organised and beds made, so the first evening is a normal one.","included":["Shelves, books and décor arranged","Bathrooms stocked and organised","Storage and utility areas sorted","Beds made for the first night"]},
  {"id":"handover","name":"Handover & QC","kind":"Core service","addon":false,"img":"/assets/handover.png","alt":"Simply Unpack handing over keys to a couple in a finished home","blurb":"Room-by-room check with photo and video handover.","foot":"Verified before we leave","price":"In every package","covers":"Every room","long":"Room-by-room quality check with photo and video handover, plus a punch list of anything pending. If you are not in the city, the same handover arrives on your phone.","included":["Walkthrough of every room with you","Photo and video record of the finished home","Punch list for anything still open","Remote approval if you are away"]},
  {"id":"clean","name":"Deep cleaning","kind":"Add-on","addon":true,"img":"/assets/deep-clean.png","alt":"Simply Unpack crew mopping and treating an empty apartment","blurb":"All rooms and washrooms deep cleaned before the boxes arrive.","foot":"Before boxes arrive","price":"Quoted after survey","covers":"All rooms","long":"Done before your boxes arrive, so nothing gets put away into a dirty cabinet. All rooms including washrooms are deep cleaned.","included":["Floors, skirting and windows","Kitchen cabinets inside and out","Washrooms sanitised","Balconies and utility areas","Finished before delivery day"]},
  {"id":"pest","name":"Pest control","kind":"Add-on","addon":true,"img":"/assets/pest-control.png","alt":"Simply Unpack technician treating an empty apartment","blurb":"Treated while the home is still empty — the only easy time to do it.","foot":"Before boxes arrive","price":"Quoted after survey","covers":"Whole home","long":"An empty home is the only easy time to treat it. Pest control is completed before delivery, with the products and waiting period shared up front.","included":["General treatment across all rooms","Kitchen and washroom focus","Products and safety window shared in writing","Scheduled before your movers arrive"]},
  {"id":"ready","name":"Home readiness","kind":"Add-on","addon":true,"img":"/assets/home-readiness.png","alt":"Simply Unpack surveyor checking electrical and plumbing points","blurb":"Electrical and plumbing checks and setup planning before delivery.","foot":"Before your movers arrive","price":"Quoted after survey","covers":"Access & utilities","long":"Basic electrical and plumbing checks, property access validation and setup planning before delivery. If we find an issue we document it, keep unaffected work moving, and ask before any paid or irreversible work.","included":["Electrical points and fixtures checked","Taps, drains and inlets checked","Lift, access and society permissions validated","Room plan agreed before boxes land"]},
  {"id":"install","name":"Installations","kind":"Add-on","addon":true,"img":"/assets/installations.png","alt":"Simply Unpack technician mounting a television","blurb":"TV, beds, curtains and basic fittings so rooms work on day one.","foot":"TV · beds · curtains","price":"Quoted after survey","covers":"Selected items","long":"Coordinate and complete selected furniture and appliance setup so rooms are usable on day one. Subject to property conditions, product compatibility and technician availability.","included":["TV wall mount and cable routing","Beds and wardrobes assembled","Curtain rods and blinds fitted","Washing machine and basic appliance hookup"]},
]

export const BHK = [
  { v: '1', label: '1 BHK', price: '₹11,999', amount: 11999, hours: '18 man hours, pre-pack to setup' },
  { v: '2', label: '2 BHK', price: '₹15,999', amount: 15999, hours: '42 man hours, pre-pack to setup' },
  { v: '3', label: '3 BHK', price: '₹22,999', amount: 22999, hours: '60 man hours, pre-pack to setup' },
  { v: 'room', label: 'By the room', price: 'From ₹4,999', amount: 4999, hours: 'A single room or a studio' },
];

export const AREAS = ['Whitefield', 'Sarjapur Road', 'HSR Layout', 'Koramangala', 'Indiranagar', 'Bellandur', 'Marathahalli', 'Electronic City', 'Hebbal', 'Yelahanka'];

export const WHEN = [
  { v: 'week', label: 'This week', note: '2 slots left' },
  { v: 'fort', label: 'In a fortnight', note: 'open' },
  { v: 'this', label: 'This month', note: 'open' },
  { v: 'month', label: 'Next month', note: 'open' },
  { v: 'unsure', label: 'Date not fixed yet', note: 'plan anyway' },
];

export const SLOTS = [
  { v: 'tmrw', label: 'Tomorrow, 10:00–13:00', note: '2 left' },
  { v: 'sat', label: 'Saturday, 11:00–14:00', note: '5 left' },
  { v: 'video', label: 'Video survey, today', note: 'no visit' },
];

export const REVIEWS = [
  { q: '“The biggest value was not unpacking. It was arriving Sunday evening and knowing the kitchen, beds and wardrobes were already usable.”', i: 'AK', m: 'Ankit & Kavya · Koramangala → Whitefield' },
  { q: '“I managed the entire setup remotely. The photo updates and approvals made it feel controlled even though I was not in the city.”', i: 'RS', m: 'Rhea S. · Indiranagar → HSR Layout' },
  { q: '“They found a plumbing issue before putting things away, showed us the options, fixed it and still finished on time.”', i: 'VM', m: 'Vikram M. · Marathahalli → Sarjapur Road' },
];

export const TRUST = [
  { k: 'Insured', v: 'crews, ID-carried' },
  { k: 'Women-led', v: 'trained in-house teams' },
  { k: 'Photo QC', v: 'handover before we leave' },
];

export const STEPS = [
  {"n":"01","t":"Free survey, one quote","d":"We walk your current home and check access at both buildings."},
  {"n":"02","t":"Pre-pack & pack","d":"Valuables and fragile items first, then every room packed and labelled."},
  {"n":"03","t":"Move","d":"Loaded, moved across Bengaluru and placed room-wise. Track the truck live."},
  {"n":"04","t":"Unpack & set up","d":"Every carton unpacked, kitchen and wardrobes set up, every room organised."},
  {"n":"05","t":"Handover","d":"Room-by-room QC with photo and video. Move-in ready."},
]

export const FILTERS = ['All', 'Core service', 'Add-on', 'Packing & moving', 'Home setup'];
export const DAY_ONE = ['unpack', 'kitchen', 'wardrobe', 'organise', 'handover'];
export const BEFORE = ['prepack', 'movers'];

export const STAGES = [
  {"id":"survey","name":"Free survey","when":"Sat 11:00","note":"Inventory at your current home and access at both buildings checked. One quote sent in writing.","crew":"Arun P.","role":"Surveyor"},
  {"id":"prepack","name":"Pre-pack","when":"Mon 10:00","note":"Valuables, documents and fragile items packed and sealed. Every room labelled.","crew":"Shobha M. +1","role":"Pre-pack crew"},
  {"id":"prep","name":"New home prep","when":"Tue 09:30","note":"Deep cleaning, pest control and readiness checks at the new home. One loose kitchen tap flagged.","crew":"Ravi S. +2","role":"Cleaning & readiness"},
  {"id":"pack","name":"Packing & loading","when":"Today 08:00","note":"48 crates packed, furniture wrapped and loaded at your current home.","crew":"Lakshmi K. +3","role":"Packing crew"},
  {"id":"move","name":"Moving","when":"Today","note":"Truck 7 is on the way to your new home.","crew":"Lakshmi K. +3","role":"Crew lead · truck 7"},
  {"id":"unpack","name":"Unpacking","when":"Today 15:00","note":"Crates placed room-wise and emptied. Packing waste removed.","crew":"Lakshmi K. +3","role":"Setup crew"},
  {"id":"kitchen","name":"Kitchen setup","when":"Thu 09:00","note":"Cabinets zoned, utensils washed, pantry sorted.","crew":"Lakshmi K. +1","role":"Setup crew"},
  {"id":"wardrobe","name":"Wardrobe setup","when":"Thu 12:00","note":"Clothes hung by category and daily use, delicate wear bagged.","crew":"Shobha M. +1","role":"Setup crew"},
  {"id":"organise","name":"Home organising","when":"Thu 15:00","note":"Living room, bedrooms, bathrooms and storage set up.","crew":"Lakshmi K. +3","role":"Setup crew"},
  {"id":"handover","name":"Handover & QC","when":"Thu 18:00","note":"Room-by-room walkthrough with photo and video handover.","crew":"Lakshmi K.","role":"Crew lead"},
]

export const ARRANGEMENTS = [
  {"k":"Pre-pack done","v":"Valuables, documents and fragile items sealed on Monday","ok":true},
  {"k":"Current home lift booked","v":"Today 08:00–12:00, service lift","ok":true},
  {"k":"New home lift booked","v":"Today 14:00–18:00, service lift 2","ok":true},
  {"k":"Parking cleared at both homes","v":"Truck bay at the B block gate on arrival","ok":true},
  {"k":"Crew assigned","v":"Lakshmi K. and three others, all ID-carried","ok":true},
  {"k":"Handover slot","v":"Thursday 18:00, photo and video record","ok":false},
]

// (MOCK) add-on prices quoted after survey
export const ADDON_PRICE = { clean: 3499, pest: 1999, ready: 999, install: 2499 };
export const TAP_FIX_PRICE = 650; // (MOCK)
export const ADVANCE_SHARE = 0.2;

export const PAY = [
  { v: 'upi', label: 'UPI', note: 'GPay, PhonePe, Paytm' },
  { v: 'card', label: 'Credit or debit card', note: 'Visa, Mastercard, RuPay' },
  { v: 'net', label: 'Netbanking', note: 'All major banks' },
  { v: 'emi', label: 'EMI', note: '3 or 6 months on select cards' },
];
export const CASH = { v: 'cash', label: 'Cash or UPI to the crew lead', note: 'At handover' };

export const NOTIFS = [
  { id: 'hand', stage: 'live', t: 'Crew has finished — sign off the handover', d: 'Room-by-room photos and the punch list are ready.', when: 'Just now', to: '/move/handover' },
  { id: 'tap', stage: 'live', t: 'Approval needed: kitchen tap', d: 'Cartridge is leaking. Fix for ₹650 or add it to the punch list.', when: '25 min', to: '/move/approvals' },
  { id: 'ward', stage: 'live', t: 'Photo approval: master wardrobe', d: 'Hung by category and daily use. Approve or ask for changes.', when: '1 hr', to: '/move/approvals' },
  { id: 'truck', stage: 'live', t: 'Truck 7 left your current home', d: '48 crates on board. Lakshmi K. is leading the crew.', when: '3 hrs', to: '/move/track' },
  { id: 'adv', stage: 'live', t: 'Advance received', d: 'Your crew, truck and lift slot are locked. Balance is due at handover.', when: 'Mon', to: '/move' },
  { id: 'quote', stage: 'quote', t: 'Your written quote is ready', d: 'Review the line items, then approve with a 20% advance.', when: 'Sat', to: '/move/quote' },
  { id: 'survey', stage: 'quote', t: 'Survey confirmed', d: 'Arun P. will visit Saturday, 11:00–14:00.', when: 'Fri', to: '/move' },
];

export const RESCHED = ['Sat 26 Sep', 'Mon 28 Sep', 'Wed 30 Sep', 'Sat 3 Oct'];
export const RATE_TAGS = ['On time', 'Careful with fragile items', 'Kitchen set up well', 'Clear updates', 'Tidy finish'];
export const QUICK_REPLIES = ['Change my move date', 'Where is the truck?', 'Question about my quote'];
export const QC_ROOMS = ['Kitchen', 'Master bedroom', 'Bedroom 2', 'Living & dining', 'Washrooms'];
export const HOUSEHOLDS = ['Just me', 'Couple', 'Family with kids', 'With pets'];
export const CANCEL_POLICY = 'Free cancellation until 48 hours before your move. After that, the advance is forfeited.';
export const INITIAL_CHAT = [{ me: false, text: 'Hi, I’m Divya from Simply Unpack. Ask me anything about your move — dates, quote or crew.' }];
