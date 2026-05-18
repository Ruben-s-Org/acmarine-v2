export interface ServiceDef {
  slug: string
  name: string
  shortName: string
  tagline: string
  intro: string
  description: string
  highlights: string[]
  faqs: { q: string; a: string }[]
}

export interface LocationDef {
  slug: string
  name: string
  region: string
  country: string
  description: string
  harbours: string[]
  flavor: string
  geo?: { lat: number; lng: number }
}

export const SERVICES: ServiceDef[] = [
  {
    slug: 'yacht-management',
    name: 'Yacht Management',
    shortName: 'Management',
    tagline: 'End-to-end yacht management.',
    intro: 'We handle the operational and administrative side of yacht ownership so you can focus on enjoying the water.',
    description:
      "Aldridge & Charles Marine serves as your shoreside office. Our team manages the day-to-day operations of your vessel, from accounting and insurance to crew contracts, classification, and regulatory filings. You receive a clear monthly report and weekly briefings from a single senior contact who knows your boat and your priorities.",
    highlights: [
      'A single senior contact for every client, available by direct line',
      'Monthly financial reports with every invoice itemised',
      'Flag and classification advisory across the major registries',
      'Crew payroll and contracts in compliance with MLC 2006',
    ],
    faqs: [
      { q: 'How is yacht management billed?', a: 'By retainer on an annual contract, paid quarterly in advance. Project costs and pass-through expenses are billed separately at cost, with all receipts shared.' },
      { q: 'Will your team hold delegated authority to act on our behalf?', a: 'Yes, where you grant it in writing. Most engagements include a limited power of attorney for routine class, flag, port, and customs filings.' },
      { q: 'Can you manage a vessel we already own?', a: 'Yes. The first thirty days are a handover: file audit, crew interviews, class and flag review, and an insurance benchmark.' },
    ],
  },
  {
    slug: 'brokerage',
    name: 'Brokerage & Acquisition',
    shortName: 'Brokerage',
    tagline: 'Yachts for sale across South Florida and the Caribbean.',
    intro: 'We represent buyers and sellers of motor and sailing yachts in the Florida and Caribbean markets.',
    description:
      'Our brokerage practice handles the acquisition and sale of significant yachts for a small number of clients each year. We carry both publicly listed vessels and a private dossier of yachts available off-market through long-standing client relationships. From the first conversation to closing, you work with the same senior team member.',
    highlights: [
      'Off-market dossier maintained for retained buyers',
      'Straightforward commission structure with no referral fees',
      'Pre-survey condition review by independent licensed surveyors',
      'Closing handled with marine counsel in your jurisdiction',
    ],
    faqs: [
      { q: 'Do you list yachts publicly for sale?', a: 'Both. Many of our vessels are listed publicly, while others are presented privately to retained buyers under confidence agreements.' },
      { q: 'How are brokerage fees structured?', a: 'Sell-side mandates are commission-based, at a fixed rate disclosed before any agreement is signed. Buy-side searches are retainer-based, with the retainer credited against any commission at closing.' },
      { q: 'Can you arrange surveys and sea trials?', a: 'Yes. We work with a vetted list of marine surveyors across Florida, the Bahamas, and the Caribbean, and can introduce surveyors in other regions on request.' },
    ],
  },
  {
    slug: 'refit',
    name: 'Refit & Project Oversight',
    shortName: 'Refit',
    tagline: "Owner's representative at the yard.",
    intro: 'From cosmetic refinishing to engineering repower, we represent owners at the shipyard until launch.',
    description:
      'Refit and project oversight covers every scale of yard work. We attend the yard daily, audit invoices line by line, photograph progress, manage the schedule, and stay through launch trials. Our team manages refits at yards across Florida and the Caribbean.',
    highlights: [
      "Resident owner's representative for the duration of the yard period",
      'Daily yard meetings and weekly written briefings',
      'Invoice audit and change-order control against the agreed scope',
      'Punch list closed before the owner steps aboard',
    ],
    faqs: [
      { q: 'Will you manage a refit at a yard we have chosen?', a: 'Yes. We begin with a scoping visit, a contract review with marine counsel, and a kick-off meeting with the yard manager.' },
      { q: 'How do you control cost overruns at the yard?', a: 'Through a strict change-order process. Any deviation from the agreed scope requires a written variation, priced and signed before work continues.' },
      { q: 'Do you manage interior design as part of a refit?', a: 'Yes. We coordinate the studio of your choice and serve as the operational interface with the yard.' },
    ],
  },
  {
    slug: 'crew',
    name: 'Crew Placement',
    shortName: 'Crew',
    tagline: 'Captains, engineers, and crew for yachts in South Florida.',
    intro: 'We place captains, mates, engineers, chefs, stewards, and deckhands on yachts across South Florida and the Caribbean.',
    description:
      "Crew placement is run by a senior member of our team who has stood watch and managed crew at sea. Every candidate is interviewed in person, references are read by the placement director, and credentials are verified at source. We focus on long-tenure placements: senior captain matches average just under three years with our clients, against an industry average closer to fourteen months.",
    highlights: [
      'Candidates known to our network, not pulled from a database',
      'References reviewed personally by a senior team member',
      'STCW, ENG1, and licensing verified at source',
      'Replacement guarantee on senior placements within the first ninety days',
    ],
    faqs: [
      { q: 'How is crew placement billed?', a: 'For owners hiring senior captains, there is no placement fee. The captain pays a one-time fee on accepted placement, which keeps incentives aligned. For other roles, fees are billed as a percentage of annual salary, disclosed before any search begins.' },
      { q: 'Do you handle ongoing crew administration?', a: 'Yes, for clients who also retain us for yacht management: contracts, payroll, MLC compliance, training schedules, and rotation logistics.' },
      { q: 'What is your replacement policy?', a: 'For senior placements, if the candidate leaves or is dismissed within ninety days, we conduct a replacement search at no additional fee.' },
    ],
  },
  {
    slug: 'detailing',
    name: 'Detailing & Daily Stewardship',
    shortName: 'Detailing',
    tagline: 'Detailing and daily care in South Florida.',
    intro: 'Wash, polish, varnish, paint, teak, stainless, and interior care for yachts kept in Florida.',
    description:
      'Detailing and daily stewardship is the accumulated discipline of regular, well-supervised work. We contract our detailing crews directly, supervise them on the dock, photograph the result, and audit time on the vessel. The same crew supervises your yacht month after month, so the standard is consistent and the boat is ready every weekend.',
    highlights: [
      'Detailing crews supervised directly by our team',
      'Photographic record of work before, during, and after',
      'Quarterly cosmetic audit against an agreed standard',
      'Schedule planned around your use, not around crew convenience',
    ],
    faqs: [
      { q: 'Is detailing offered as a standalone service?', a: 'Yes. We can manage detailing on a vessel without a broader retainer, either port-by-port or on a standing schedule.' },
      { q: 'How do you handle paint and varnish at the yard?', a: 'Yard-level work is handled through our refit practice. Detailing is the regular, in-the-water layer.' },
      { q: 'Can you cover a vessel during a transatlantic move?', a: 'Yes. Our detailing arrangements extend across Florida, the Bahamas, and the Caribbean, with partner crews in the Mediterranean for vessels crossing for the season.' },
    ],
  },
  {
    slug: 'charter',
    name: 'Charter Programmes',
    shortName: 'Charter',
    tagline: 'Charter your yacht, or arrange a private charter.',
    intro: 'We run charter programs for owners and arrange private charters for clients, with the itinerary, crew briefing, and logistics handled in-house.',
    description:
      "Our charter practice runs in both directions. For owners, we structure and operate a charter program for your vessel, with marketing, vetting, and post-charter reporting handled in-house. For clients chartering, we run a discreet placement process, vet every candidate yacht, and have a member of our team present at embarkation.",
    highlights: [
      'MYBA central agency relationships across major regions',
      'APA managed with line-item visibility for the owner',
      'Charter contracts reviewed by marine counsel in the relevant jurisdiction',
      'Post-charter report delivered within five business days',
    ],
    faqs: [
      { q: 'Do you market our yacht for charter?', a: 'Yes, through central agency placements that we vet, with brochure, photography, and run sheet that our team controls.' },
      { q: 'How is APA managed?', a: 'Through a dedicated charter account with daily expense capture on the boat and weekly reconciliation by our office.' },
      { q: 'Can you arrange a private charter for our family?', a: 'Yes. We run a discreet placement process across our trusted yacht network in Florida, the Bahamas, and the Caribbean.' },
    ],
  },
  {
    slug: 'engineering',
    name: 'Engineering & Technical Counsel',
    shortName: 'Engineering',
    tagline: 'Engineering and technical counsel.',
    intro: 'Repower studies, propulsion modelling, navigation electronics, and classification advisory, all handled in-house.',
    description:
      "Engineering and technical counsel is our in-house technical capability. We commission and review repower studies, propulsion modelling, hull modification analyses, and classification submissions. Our technical lead reviews yard proposals and engineering reports on your behalf and stays on-site for major refits.",
    highlights: [
      'In-house technical review of yard proposals and engineering reports',
      'Independent second-opinion reports for insurance and classification',
      'No commissions on parts, equipment, or specified vendors',
      'Technical lead resident during major refits',
    ],
    faqs: [
      { q: 'Is engineering counsel standalone or part of a retainer?', a: "Both. It is included for retained clients and offered standalone on a fixed-fee basis." },
      { q: 'Do you specify equipment or recommend brands?', a: 'We assess on merit. We hold no preferred-vendor arrangements.' },
      { q: 'Can you support an insurance claim with technical reporting?', a: 'Yes. We prepare independent technical reports for underwriters when a claim is contested.' },
    ],
  },
  {
    slug: 'concierge',
    name: 'Berths, Transits & Concierge',
    shortName: 'Concierge',
    tagline: 'Berths, transits, and concierge services.',
    intro: 'Marina reservations, customs, transit planning, fuel, and provisioning, all handled by people who know the docks personally.',
    description:
      'Our concierge practice handles the shore-side logistics that no captain should have to chase in an unfamiliar port. Marina reservations across the priority docks, customs and immigration coordination, transit planning, fuel, provisioning, and security arrangements when required.',
    highlights: [
      'Standing relationships at priority marinas in every region we cover',
      'Customs and immigration coordinated in advance, not at the dock',
      'Provisioning to your standing list, refreshed seasonally',
      '24-hour line for in-transit issues',
    ],
    faqs: [
      { q: 'How are concierge services billed?', a: 'Included in the management retainer for retained clients. Available on a per-event fee for standalone use.' },
      { q: "Can you reserve berths at marinas we haven't visited before?", a: 'In most cases, yes. We hold standing arrangements with priority marinas across Florida, the Bahamas, and the Caribbean.' },
      { q: 'What does the 24-hour line cover?', a: 'Time-sensitive logistics: customs clearance, a guest medical issue, weather diversion, urgent vendor coordination.' },
    ],
  },
]

export const LOCATIONS: LocationDef[] = [
  {
    slug: 'miami',
    name: 'Miami',
    region: 'South Florida',
    country: 'United States',
    description: "Miami is our home port and the center of yachting on Florida's east coast. From the marinas of Miami Beach and Coconut Grove out through Government Cut, our team works on vessels here daily.",
    harbours: ['Miami Beach Marina', 'Sea Isle Marina', 'Dinner Key Marina', 'Coconut Grove'],
    flavor: "the center of yachting on Florida's east coast and our home port",
    geo: { lat: 25.7617, lng: -80.1918 },
  },
  {
    slug: 'fort-lauderdale',
    name: 'Fort Lauderdale',
    region: 'South Florida',
    country: 'United States',
    description: 'Fort Lauderdale is the largest yachting market in the Western Hemisphere. We work with owners and crews across Bahia Mar, Pier Sixty-Six, Las Olas, and the Dania Cut-Off Canal yards.',
    harbours: ['Bahia Mar Yachting Center', 'Pier Sixty-Six Marina', 'Las Olas Marina', 'Dania Cut-Off Canal yards'],
    flavor: 'the largest yachting market in the Western Hemisphere',
    geo: { lat: 26.1224, lng: -80.1373 },
  },
  {
    slug: 'palm-beach',
    name: 'Palm Beach',
    region: 'South Florida',
    country: 'United States',
    description: 'Palm Beach and the broader county host some of the most private yachting in the United States, from Lake Worth Inlet to Jupiter. Our team has standing relationships with the marinas along this stretch of coast.',
    harbours: ['Palm Harbor Marina', 'Sailfish Marina', 'Old Port Cove', 'Loggerhead Marina'],
    flavor: "the quieter end of South Florida's yachting coast",
    geo: { lat: 26.7056, lng: -80.0364 },
  },
  {
    slug: 'naples',
    name: 'Naples',
    region: 'Southwest Florida',
    country: 'United States',
    description: 'Naples and the Gulf side give Florida owners year-round access to the Bahamas circuit and a shoulder-season alternative to the Atlantic. We coordinate maintenance, transits, and crew rotations between coasts.',
    harbours: ['Naples City Dock', 'Hamilton Harbor Yacht Club', 'Marco Island Yacht Club'],
    flavor: "the Gulf Coast counterpart to South Florida's Atlantic ports",
    geo: { lat: 26.1420, lng: -81.7948 },
  },
]

export function findService(slug: string): ServiceDef | undefined { return SERVICES.find(s => s.slug === slug) }
export function findLocation(slug: string): LocationDef | undefined { return LOCATIONS.find(l => l.slug === slug) }
