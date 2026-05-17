<script setup lang="ts">
useSeoMeta({
  title: 'Terms of Engagement. Aldridge & Charles Marine.',
  description: 'Terms of engagement governing services provided by Aldridge & Charles Marine, including brokerage, management, refit, charter, crew placement, and related practices.',
})
useHead({ link: [{ rel: 'canonical', href: 'https://acmarine.com/terms' }] })

const sections = [
  { id: 'about', title: 'About these terms' },
  { id: 'definitions', title: 'Definitions and interpretation' },
  { id: 'office', title: 'The office and the engagement' },
  { id: 'site', title: 'Information published on this site' },
  { id: 'kyc', title: 'Onboarding, KYC and acceptance' },
  { id: 'brokerage', title: 'Brokerage and acquisition' },
  { id: 'management', title: 'Yacht management' },
  { id: 'charter', title: 'Charter programmes' },
  { id: 'refit', title: 'Refit and project oversight' },
  { id: 'crew', title: 'Crew placement' },
  { id: 'detailing', title: 'Detailing and daily stewardship' },
  { id: 'engineering', title: 'Engineering and technical counsel' },
  { id: 'concierge', title: 'Berths, transits and concierge' },
  { id: 'fees', title: 'Fees, retainers and disbursements' },
  { id: 'conflicts', title: 'Conflicts of interest' },
  { id: 'aml', title: 'Anti-money laundering, sanctions and anti-bribery' },
  { id: 'confidentiality', title: 'Confidentiality and use of name' },
  { id: 'ip', title: 'Intellectual property' },
  { id: 'indemnity', title: 'Indemnity' },
  { id: 'liability', title: 'Limitation of liability' },
  { id: 'insurance', title: 'Insurance' },
  { id: 'force-majeure', title: 'Force majeure' },
  { id: 'termination', title: 'Termination' },
  { id: 'law', title: 'Governing law and dispute resolution' },
  { id: 'notices', title: 'Notices and communications' },
  { id: 'general', title: 'General provisions' },
  { id: 'contact', title: 'Contact' },
]
</script>

<template>
  <div class="px-4 md:px-6">
    <main class="container mx-auto max-w-[820px] py-10 md:py-16">
      <p class="eyebrow">Terms</p>
      <h1 class="font-serif text-navy mt-3 mb-2" style="font-size: clamp(2.4rem, 6vw, 4rem); line-height: 1.05">Terms of engagement.</h1>
      <p class="text-xs uppercase tracking-widest text-ink/50 mb-8">Effective 17 May 2026.</p>

      <p class="text-base md:text-lg leading-relaxed text-ink/82 mb-8">
        These Terms of Engagement (the "Terms") govern the provision of professional services by Aldridge &amp; Charles Marine (the "office", "we", "us", or "our") to retained principals and other clients (each a "Principal" or "you"). They apply to every engagement undertaken by the office, every communication carried out through this website, and every visit to it.
      </p>
      <p class="text-base md:text-lg leading-relaxed text-ink/82 mb-12">
        By instructing the office, executing a letter of appointment, or otherwise engaging us, you confirm that you have read, understood, and accepted these Terms in their entirety, together with any additional terms contained in the letter of appointment specific to your engagement.
      </p>

      <nav class="border border-rule bg-white/60 p-6 mb-12" aria-label="Contents">
        <p class="eyebrow mb-3">Contents</p>
        <ol class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm font-serif text-navy">
          <li v-for="(s, i) in sections" :key="s.id"><a :href="`#${s.id}`" class="hover:text-brass-deep transition-colors">{{ i + 1 }}. {{ s.title }}</a></li>
        </ol>
      </nav>

      <article class="legal space-y-12 text-base md:text-[1.04rem] leading-[1.78] text-ink/86">

        <section id="about">
          <h2>1. About these terms</h2>
          <p>1.1 These Terms set out the basis on which the office provides yacht management, brokerage and acquisition, refit and project oversight, charter programmes, crew placement, detailing and daily stewardship, engineering and technical counsel, berths, transits and concierge services, and any other service offered by the office from time to time (each a "Service" and together the "Services").</p>
          <p>1.2 Each engagement is additionally governed by a written letter of appointment ("Letter of Appointment") setting out the specific Services to be provided, the term, the retainer or commission structure, and any additional terms applicable to that engagement. In the event of any conflict between these Terms and a Letter of Appointment, the Letter of Appointment shall prevail in relation to that engagement.</p>
          <p>1.3 No contract is created between the office and a prospective client until (a) the office has confirmed in writing its acceptance of the engagement, and (b) a Letter of Appointment has been duly executed by both parties, save where these Terms or applicable law provide otherwise.</p>
          <p>1.4 The office may amend these Terms from time to time. Amendments take effect from the date posted on this site and apply to engagements commenced on or after that date. Existing engagements continue to be governed by the Terms in force at the date of the relevant Letter of Appointment, save where the parties otherwise agree in writing.</p>
        </section>

        <section id="definitions">
          <h2>2. Definitions and interpretation</h2>
          <p>2.1 In these Terms, unless the context otherwise requires:</p>
          <ul class="list-disc pl-6 space-y-1">
            <li><strong>"Applicable Law"</strong> means the law and regulations applicable to the Vessel, the engagement, the parties and any third party from time to time, including but not limited to the law of the flag state, the law of any port state, the law of the place of contracting, and any international convention to which any such state is party (including MLC 2006, SOLAS, MARPOL, STCW and the Polar Code).</li>
            <li><strong>"Engagement"</strong> means the engagement of the office under a Letter of Appointment.</li>
            <li><strong>"MOA"</strong> means a memorandum of agreement for the sale and purchase of a Vessel, typically in the form of the Norwegian Saleform or such other form as the parties agree.</li>
            <li><strong>"Principal"</strong> means the natural or legal person retaining the office under a Letter of Appointment.</li>
            <li><strong>"Pass-through Costs"</strong> means costs incurred by the office on behalf of the Principal and billed to the Principal at cost, including but not limited to yard invoices, classification society fees, registration fees, port dues, customs duties, crew payroll, provisions, travel, third-party professional fees, and similar costs.</li>
            <li><strong>"Sanctions"</strong> means trade, economic or financial sanctions, embargoes or restrictive measures imposed, administered or enforced from time to time by the United Nations Security Council, the European Union, His Majesty's Government, the Office of Foreign Assets Control of the United States Department of the Treasury (OFAC), the United States Department of State, or any other competent authority.</li>
            <li><strong>"Site"</strong> means this website, including all subdomains operated by the office.</li>
            <li><strong>"Vessel"</strong> means the yacht or other vessel that is the subject of an Engagement.</li>
          </ul>
          <p>2.2 Headings are for convenience only and do not affect interpretation. References to "writing" include email and any other durable record. References to a statute or regulation include any amendment, re-enactment or replacement.</p>
        </section>

        <section id="office">
          <h2>3. The office and the engagement</h2>
          <p>3.1 The office is a private marine office. Services are delivered by a single director on duty assigned to the Principal, supported by such other personnel as the office considers appropriate. The Principal acknowledges that the office may, in its discretion, change the director on duty on reasonable notice.</p>
          <p>3.2 The office acts as an independent professional. Save where expressly stated in a Letter of Appointment, nothing in these Terms or any communication between the parties shall constitute the office a partner, joint venturer, employee, employer, agent (other than for the specific authorities granted in writing), trustee or fiduciary of the Principal. The office is not authorised to bind the Principal save to the extent expressly granted under a Letter of Appointment, a limited power of attorney, or a separate written authorisation.</p>
          <p>3.3 The office reserves the right to decline any prospective engagement at its absolute discretion, and to terminate an existing engagement in accordance with clause 23.</p>
          <p>3.4 The office maintains a closed roster. Acceptance of an engagement is conditional upon completion of the onboarding and acceptance procedures set out at clause 5.</p>
        </section>

        <section id="site">
          <h2>4. Information published on this site</h2>
          <p>4.1 Information on the Site is published for general information only. It is not, and shall not be construed as, a survey, valuation, brokerage offer, listing, sale, charter offer, employment offer, tax opinion, legal opinion, regulatory opinion, recommendation, solicitation, or inducement of any kind.</p>
          <p>4.2 Vessel descriptions, photographs, dimensions, specifications, equipment lists, performance figures, fuel consumption, range, classifications, flags, prior refits, ownership history, location, asking price, and any other details published on the Site are believed correct at the time of publication but are not warranted. Such details are subject to confirmation in writing by the Principal of the Vessel, to physical inspection, to professional survey, and to such other verification as the prospective buyer or charterer may require. The office accepts no responsibility for any reliance placed on Site content otherwise than in connection with an executed Engagement.</p>
          <p>4.3 Vessels are presented strictly on an "as-is, where-is" basis. No warranty (express, implied, statutory or otherwise) is given as to seaworthiness, condition, suitability for any particular purpose, compliance with any flag or class requirement, freedom from defect, freedom from liens, or freedom from any other encumbrance.</p>
          <p>4.4 Use of the Site is at the user's risk. The Site is provided without warranty of any kind. The office shall not be liable for any loss arising from use of, reliance on, or inability to use the Site.</p>
          <p>4.5 The Site is intended for use by persons who are, or who are advised by, sophisticated maritime, legal and financial professionals. The Site is not directed to persons under the age of eighteen, and the office does not knowingly collect information from such persons.</p>
        </section>

        <section id="kyc">
          <h2>5. Onboarding, KYC and acceptance</h2>
          <p>5.1 Acceptance of any engagement is conditional upon completion of the office's onboarding procedures, including without limitation customer due diligence consistent with applicable anti-money laundering, counter-terrorist financing and sanctions legislation.</p>
          <p>5.2 The Principal shall promptly provide such information and documentation as the office may require, including but not limited to (a) identification of the Principal and, where applicable, of its directors, beneficial owners, settlors and trustees; (b) proof of address; (c) the source of funds and the source of wealth to be deployed in connection with the engagement; (d) information sufficient to identify the Vessel and its ownership structure; (e) any flag, class, insurance and registration documents pertaining to the Vessel; and (f) such other documentation as the office considers necessary to discharge its regulatory and professional obligations.</p>
          <p>5.3 The office may carry out, or instruct independent third parties to carry out, any verification, screening and continuous monitoring required for the office to comply with Applicable Law. The cost of such verification and screening is a Pass-through Cost and is recoverable from the Principal.</p>
          <p>5.4 The office may decline to commence, may pause, and may terminate any engagement at any time if (a) it is unable to complete its due diligence to its reasonable satisfaction; (b) it forms the view that the engagement carries unacceptable legal, regulatory, reputational, sanctions, money laundering or terrorist-financing risk; or (c) any Principal information or documentation is found to be incomplete, inaccurate, misleading or fraudulent.</p>
          <p>5.5 Information collected under this clause is processed in accordance with the office's <NuxtLink to="/privacy" class="underline underline-offset-4 decoration-brass text-brass-deep">Privacy Notice</NuxtLink>.</p>
        </section>

        <section id="brokerage">
          <h2>6. Brokerage and acquisition</h2>
          <p>6.1 The office's brokerage and acquisition practice covers the introduction, presentation and negotiation of sale, purchase and central-agency engagements in relation to motor and sailing yachts.</p>
          <p>6.2 Brokerage engagements are governed by a Letter of Appointment setting out (a) whether the office is acting on the buy-side, the sell-side, or otherwise; (b) the commission structure, including any retainer to be credited against commission at closing; (c) the duration and territory of the mandate; (d) the rights of either party to terminate or extend the mandate; and (e) any specific exclusivity provisions.</p>
          <p>6.3 The office shall not act for both buyer and seller in a single transaction without the prior written consent of both parties, made on a fully informed basis. Where consent is given, the office shall act with even-handedness and without preferring the interests of one party over those of the other.</p>
          <p>6.4 Vessels are presented strictly on an "as-is, where-is" basis. No representation or warranty is given by the office as to the condition of the Vessel, its seaworthiness, the accuracy of any technical particulars, the absence of liens, encumbrances or charges, compliance with any flag, class or regulatory requirement, suitability for charter, suitability for cruise of any region, or freedom from any defect (latent or patent).</p>
          <p>6.5 The buyer is solely responsible for, and shall instruct independent professionals to carry out, a pre-purchase survey, sea trials, machinery and equipment surveys, hull and rigging inspections, classification reviews, flag transfer checks, lien and title searches, insurance underwriting reviews, valuation, and any other inspection or verification the buyer considers prudent. All such inspections are undertaken at the buyer's risk and cost. The office bears no responsibility for the findings or omissions of any such professional.</p>
          <p>6.6 The terms of sale and purchase of any Vessel shall be set out in a Memorandum of Agreement to be agreed and executed between buyer and seller, typically in the form of the Norwegian Saleform with such amendments as the parties agree. The office assists with the negotiation of the MOA but does not become a party to it.</p>
          <p>6.7 Deposit monies, where applicable, shall be held by an independent escrow agent or by the office's nominated client account in accordance with the MOA. The office does not commingle deposit monies with its own funds. Release of deposit is governed by the MOA.</p>
          <p>6.8 No oral statement, draft document, photograph or representation shall give rise to any binding obligation absent a fully executed MOA. Negotiations are conducted "subject to contract" and "subject to satisfactory survey" until such time as the parties expressly waive that protection in writing.</p>
          <p>6.9 Commission is earned by the office upon closing (or, where the Letter of Appointment so provides, upon the breach of an MOA by the party not represented by the office). Commission is payable from the gross sale proceeds at completion and is not refundable.</p>
        </section>

        <section id="management">
          <h2>7. Yacht management</h2>
          <p>7.1 Yacht management engagements typically cover flag and class administration, regulatory compliance (including MLC 2006), insurance brokering and renewal coordination, accounts and bookkeeping, payroll, crew contracts, technical record-keeping, refit oversight (under the practice at clause 9), and related advisory.</p>
          <p>7.2 The office acts as the Principal's shoreside office. Delegated authority is granted by the Principal in writing, typically by means of a limited power of attorney for routine class, flag, port, customs and vendor matters, together with a separate signing authority for vendor invoices below an agreed threshold. The Principal retains all authority not so delegated.</p>
          <p>7.3 The Principal shall remain the registered owner of the Vessel and the employer of any crew, save where a specific structuring engagement provides otherwise. The office does not warrant the seaworthiness of the Vessel, nor the safety or competence of any third party.</p>
          <p>7.4 The office shall procure that books are kept in accordance with the standard expected of a professional marine office, available to the Principal on reasonable notice. The Principal acknowledges that the office is not a regulated bookkeeper, accountant, auditor, tax adviser or legal adviser, and shall instruct such professionals separately as the Principal considers necessary.</p>
        </section>

        <section id="charter">
          <h2>8. Charter programmes</h2>
          <p>8.1 The office operates owner-side charter programmes (placing the Vessel into the central-agency or open market with vetted partners) and charterer-side private placements (sourcing and vetting a vessel for a specific charter on behalf of a private client).</p>
          <p>8.2 Charter agreements shall be in the form of the MYBA Charter Agreement or such other industry-standard form as the parties agree. APA is managed in a dedicated account with line-item visibility, weekly reconciliation, and a written close-out within five working days of disembarkation. APA is subject to the terms of the charter agreement, not these Terms.</p>
          <p>8.3 The Principal acknowledges that charter operations are subject to weather, mechanical breakdown, regulatory closure, force majeure events, and other matters outside the control of the office. The office does not guarantee the availability, performance, condition or compliance of any vessel marketed for charter.</p>
          <p>8.4 Charter VAT and similar taxes are matters for the Principal's own tax adviser. The office may comment on industry practice but does not provide tax advice.</p>
        </section>

        <section id="refit">
          <h2>9. Refit and project oversight</h2>
          <p>9.1 Under a refit engagement, the office acts as the Principal's owner's representative at the shipyard. The office does not become a party to any contract between the Principal and the yard, save where expressly agreed in a Letter of Appointment.</p>
          <p>9.2 All variations from agreed scope shall be documented in a written change-order log, priced and signed before work continues. The Principal shall not direct yard personnel except through the office or with prior written notice to it.</p>
          <p>9.3 The office does not warrant the work of any yard, sub-contractor, supplier, classification surveyor, flag state surveyor, naval architect, designer or other professional. Any warranties or guarantees from such third parties accrue directly to the Principal.</p>
        </section>

        <section id="crew">
          <h2>10. Crew placement</h2>
          <p>10.1 The office's crew placement practice introduces candidates for crew positions on the Principal's Vessel. The office is not, and does not hold itself out as, the employer of any crew member presented to the Principal. The Principal employs crew directly and is responsible for all employer obligations under Applicable Law (including MLC 2006, the relevant flag state employment regime, payroll, tax, social security and health and safety).</p>
          <p>10.2 The office verifies certifications (STCW, ENG1, and equivalents) at source, reads written references in person, and conducts a face-to-face interview prior to making any senior placement. The office does not warrant the future conduct, competence or performance of any crew member once placed.</p>
          <p>10.3 A replacement guarantee applies to senior placements (captain, chief engineer, head chef) where the crew member leaves or is dismissed for performance reasons within ninety (90) days of joining, and to all other placements within sixty (60) days. The replacement search is carried out at no additional placement fee. Travel and disbursements remain Pass-through Costs.</p>
          <p>10.4 The Principal shall comply with all employment, immigration, taxation and labour laws applicable to the engagement of crew. The office does not advise on those matters and recommends that the Principal retain employment counsel of its own choosing.</p>
        </section>

        <section id="detailing">
          <h2>11. Detailing and daily stewardship</h2>
          <p>11.1 Detailing engagements include varnish, paint, leather, teak, polish, deep wash, brightwork and related cosmetic maintenance. The office contracts detailing crews directly or supervises crews engaged by the Principal, at the Principal's election.</p>
          <p>11.2 The office uses materials and methods consistent with industry practice but does not warrant any particular outcome, durability, finish or compatibility with prior coatings, substrates or repairs.</p>
        </section>

        <section id="engineering">
          <h2>12. Engineering and technical counsel</h2>
          <p>12.1 Engineering counsel covers re-power studies, propulsion modelling, hull modification analyses, navigation and communications electronics architecture, and classification submissions. Reports are produced by qualified engineers and provided to the Principal for the Principal's own decision-making.</p>
          <p>12.2 The office is not a classification society. Reports do not substitute for, and may not be presented as, classification approval, flag state approval, MCA approval or any equivalent.</p>
          <p>12.3 The office maintains no preferred-vendor arrangements and accepts no commissions, rebates, kickbacks or other benefits from manufacturers, distributors, yards, surveyors or installers. Recommendations are given on merit.</p>
        </section>

        <section id="concierge">
          <h2>13. Berths, transits and concierge</h2>
          <p>13.1 Berthing, customs, immigration, transit, fuel, provisioning, ground transport, security, helicopter coordination and related logistical services are arranged through standing relationships maintained by the office. Availability is subject to confirmation by the relevant third party.</p>
          <p>13.2 The office does not warrant the conduct, pricing, availability, quality or compliance of any third-party provider engaged on the Principal's behalf. All payment obligations to such providers are the Principal's responsibility and are billed as Pass-through Costs unless the parties otherwise agree in writing.</p>
        </section>

        <section id="fees">
          <h2>14. Fees, retainers and disbursements</h2>
          <p>14.1 Management, project, charter, crew and concierge engagements are typically billed by retainer, payable quarterly in advance, in accordance with the Letter of Appointment.</p>
          <p>14.2 Brokerage transactions are billed by commission, payable from sale proceeds at closing or upon such other trigger as the Letter of Appointment specifies.</p>
          <p>14.3 Pass-through Costs are billed at cost with reasonable evidence of expenditure. The Principal shall reimburse Pass-through Costs within thirty (30) days of receipt of invoice, or within such other period as the Letter of Appointment provides.</p>
          <p>14.4 Late payments shall bear interest at four per cent (4%) above the base rate of HSBC Bank plc (or its successor) from time to time, accruing daily from the due date until paid in full.</p>
          <p>14.5 All fees are exclusive of VAT, sales tax and any other applicable taxes, which shall be added to invoices at the rate from time to time in force.</p>
          <p>14.6 The Principal authorises the office to deduct sums owed to it from any monies held on the Principal's behalf, on reasonable notice in writing, save where the contrary is required by Applicable Law.</p>
        </section>

        <section id="conflicts">
          <h2>15. Conflicts of interest</h2>
          <p>15.1 The office maintains a written conflicts policy. Where the office identifies a potential conflict between the interests of two or more clients, or between the office and a client, it shall disclose the conflict in writing and propose an appropriate management measure (which may include declining or terminating one or more engagements).</p>
          <p>15.2 The office acts for a number of principals and prospective clients across the marine industry. The Principal acknowledges that the office's general knowledge of the industry, accumulated over time, may be applied for the benefit of other clients, save where it would amount to disclosure of the Principal's confidential information.</p>
        </section>

        <section id="aml">
          <h2>16. Anti-money laundering, sanctions and anti-bribery</h2>
          <p>16.1 The office is committed to compliance with the UK Money Laundering Regulations 2017, the EU Anti-Money Laundering Directives, the U.S. Bank Secrecy Act, the UK Bribery Act 2010, the U.S. Foreign Corrupt Practices Act, and any other Applicable Law concerning the prevention of financial crime.</p>
          <p>16.2 The Principal represents and warrants that (a) the source of funds and source of wealth deployed in connection with the engagement are lawful; (b) neither the Principal nor any beneficial owner, director, agent or affiliate is the target of Sanctions or is owned or controlled by a person who is; (c) no part of the engagement involves the laundering of proceeds of crime or the financing of terrorism; (d) no part of the engagement constitutes, supports or facilitates an unlawful payment to a government official or any other person; and (e) the Principal will inform the office in writing if any change occurs that would make any of the foregoing representations untrue.</p>
          <p>16.3 The office may, at its absolute discretion, suspend or terminate an engagement, freeze assets in its control, decline to release funds, or take any other lawful step it considers necessary to comply with Applicable Law in respect of Sanctions or financial crime. The office may make protected disclosures to competent authorities without notifying the Principal where Applicable Law so requires.</p>
        </section>

        <section id="confidentiality">
          <h2>17. Confidentiality and use of name</h2>
          <p>17.1 Each party shall keep confidential the Confidential Information of the other and shall not use it otherwise than for the purposes of the engagement.</p>
          <p>17.2 The office shall not name the Principal, the Vessel, the captain or any crew member in marketing, press, the Site, social media or any other public communication without the Principal's prior written consent, save where required by Applicable Law or by an order of a competent court or regulator.</p>
          <p>17.3 The obligations in this clause shall survive termination for a period of seven (7) years.</p>
        </section>

        <section id="ip">
          <h2>18. Intellectual property</h2>
          <p>18.1 All copyright, trade mark and other intellectual property rights in the Site, in the office's marketing materials and in any working papers prepared by the office in the course of an engagement vest in the office (or its licensors) and remain the property of the office.</p>
          <p>18.2 The Principal is granted a personal, non-exclusive, non-transferable, royalty-free licence to use such working papers as are delivered to the Principal in connection with the engagement, for the Principal's internal purposes only. The licence does not extend to onward distribution, publication or commercial exploitation.</p>
          <p>18.3 Trade marks and brand names of third parties (including yards, manufacturers, classification societies and other industry participants) appearing on the Site remain the property of their respective owners and are referred to for identification purposes only.</p>
        </section>

        <section id="indemnity">
          <h2>19. Indemnity</h2>
          <p>19.1 The Principal shall indemnify and hold harmless the office, its directors, officers, employees, sub-contractors and agents from and against any and all claims, liabilities, losses, damages, costs and expenses (including reasonable legal costs on an indemnity basis) suffered or incurred by any of them arising out of or in connection with (a) any breach by the Principal of these Terms or any Letter of Appointment; (b) any inaccuracy in any information or documentation provided by the Principal; (c) any act or omission of the Principal, the Vessel, the crew, any sub-contractor, or any third party engaged on the Principal's behalf; (d) any third-party claim relating to the Vessel; or (e) any breach by the Principal of Applicable Law.</p>
          <p>19.2 The Principal shall procure that any holding company, subsidiary, affiliate or beneficial owner that benefits directly or indirectly from the engagement shall be bound by, and the office shall be entitled to enforce, this clause as if such person were a party to these Terms.</p>
        </section>

        <section id="liability">
          <h2>20. Limitation of liability</h2>
          <p>20.1 Nothing in these Terms excludes or limits the liability of the office for (a) death or personal injury caused by its negligence; (b) fraud or fraudulent misrepresentation; or (c) any liability that cannot lawfully be excluded or limited.</p>
          <p>20.2 Subject to clause 20.1, the office shall not be liable, whether in contract, tort (including negligence), breach of statutory duty, restitution or otherwise, for any: (a) loss of profits, revenue or anticipated savings; (b) loss of use or loss of charter income; (c) loss of opportunity, goodwill or reputation; (d) loss of, damage to, or contamination of the Vessel, save to the extent caused by the office's gross negligence or wilful misconduct; (e) loss or damage to any tender, vehicle, equipment, personal property or chattel; (f) loss of data; (g) indirect, special or consequential loss; or (h) loss arising from the act, omission, default, insolvency or fraud of any third party (including any yard, surveyor, broker, captain, crew member, supplier, insurer, port authority, classification society or flag state).</p>
          <p>20.3 Subject to clause 20.1, the aggregate liability of the office under or in connection with any engagement (whether in contract, tort or otherwise) shall not exceed the lower of (a) the fees actually paid to the office by the Principal in respect of that engagement during the twelve (12) months immediately preceding the event giving rise to the claim, and (b) one million pounds sterling (GBP 1,000,000).</p>
          <p>20.4 The Principal is responsible for maintaining hull and machinery insurance, protection and indemnity (P&amp;I) cover, war risks insurance, employer's liability cover for crew, and any other insurance customary or required for the Vessel and its operation. The office is not the Principal's insurer.</p>
          <p>20.5 Time bar. Any claim by the Principal against the office shall be notified in writing within twelve (12) months of the act or omission giving rise to the claim, failing which the claim shall be deemed waived and absolutely barred.</p>
        </section>

        <section id="insurance">
          <h2>21. Insurance</h2>
          <p>21.1 The office maintains professional indemnity insurance commensurate with the scope of its practice, with reputable underwriters, in such amount as the office considers appropriate from time to time. Details are available on written request.</p>
          <p>21.2 The Principal shall procure that adequate insurance is maintained at all times in respect of the Vessel and its operation, including hull and machinery, P&amp;I, war risks, charterers' liability (where applicable) and any other cover customary or required by Applicable Law. The Principal shall name the office as an additional insured under such policies where the office reasonably so requests, at the office's cost.</p>
        </section>

        <section id="force-majeure">
          <h2>22. Force majeure</h2>
          <p>22.1 Neither party shall be liable for any failure or delay in performance (other than payment of money) caused by acts of God, fire, flood, severe weather, earthquake, pandemic, epidemic, governmental act, embargo, war, riot, civil disturbance, terrorism, piracy, sabotage, port closure, customs delay, strike, lock-out, industrial dispute, or any other cause beyond its reasonable control.</p>
          <p>22.2 The party affected shall promptly notify the other in writing and use reasonable endeavours to mitigate the effect. Where a force majeure event continues for more than ninety (90) days, either party may terminate the engagement on written notice without liability.</p>
        </section>

        <section id="termination">
          <h2>23. Termination</h2>
          <p>23.1 Either party may terminate a retainer engagement on ninety (90) days' written notice. Brokerage mandates terminate on closing, on the expiry of the mandate term, or on such other event as the Letter of Appointment provides.</p>
          <p>23.2 Either party may terminate any engagement immediately on written notice if the other (a) commits a material breach which (if capable of remedy) is not remedied within thirty (30) days of written notice requiring its remedy; (b) becomes insolvent, enters into administration, receivership, liquidation or any equivalent procedure; or (c) commits an act that is reasonably likely to bring the other into disrepute.</p>
          <p>23.3 The office may terminate any engagement immediately on written notice where required by Applicable Law, by Sanctions, or where the office identifies a financial-crime or reputational risk that cannot be adequately managed.</p>
          <p>23.4 On termination, the Principal shall pay all fees and Pass-through Costs accrued to the date of termination. The office shall, on receipt of payment in full, deliver to the Principal such files, working papers and records as the Principal reasonably requires, save where the office is entitled or required to retain them by Applicable Law or by professional standards.</p>
          <p>23.5 Clauses intended to survive termination (including clauses 5, 14, 16, 17, 18, 19, 20, 21, 23, 24 and 26) shall continue in full force.</p>
        </section>

        <section id="law">
          <h2>24. Governing law and dispute resolution</h2>
          <p>24.1 These Terms and any engagement (including any non-contractual obligation arising out of or in connection with them) shall be governed by, and construed in accordance with, the laws of England and Wales.</p>
          <p>24.2 Any dispute, controversy or claim arising out of or in connection with these Terms or any engagement, including any question regarding existence, validity or termination, shall be referred to and finally resolved by arbitration under the London Maritime Arbitrators Association (LMAA) Terms current at the time of commencement of the arbitration. The seat of arbitration shall be London. The language of the arbitration shall be English. The tribunal shall consist of three arbitrators unless the parties agree otherwise in writing.</p>
          <p>24.3 Nothing in this clause prevents either party from applying to any competent court for urgent injunctive or other interim relief.</p>
          <p>24.4 The parties agree that the United Nations Convention on Contracts for the International Sale of Goods does not apply.</p>
        </section>

        <section id="notices">
          <h2>25. Notices and communications</h2>
          <p>25.1 Notices given under or in connection with these Terms shall be in writing and shall be delivered by hand, by recorded delivery, or by email to the address last notified by the recipient.</p>
          <p>25.2 Notices sent by hand take effect on delivery. Notices sent by recorded delivery take effect two (2) business days after dispatch. Notices sent by email take effect on confirmed receipt during recipient business hours, otherwise at the start of the next business day.</p>
          <p>25.3 Routine operational communications between the office and the Principal may be conducted by email, telephone, secure messaging and such other media as the parties may adopt from time to time.</p>
        </section>

        <section id="general">
          <h2>26. General provisions</h2>
          <p>26.1 <strong>Entire agreement.</strong> These Terms, together with any Letter of Appointment, constitute the entire agreement between the parties on the subjects covered and supersede all prior agreements, communications and understandings. Each party acknowledges that it has not relied on any statement or representation not expressly set out in these Terms or the Letter of Appointment, save for fraudulent misrepresentation.</p>
          <p>26.2 <strong>Severability.</strong> If any provision is held invalid or unenforceable, the remainder shall remain in full force, and the parties shall negotiate in good faith a substitute provision reflecting the original commercial intent so far as lawful.</p>
          <p>26.3 <strong>Variation.</strong> No variation is effective unless made in writing and signed (including by electronic signature) by an authorised representative of each party.</p>
          <p>26.4 <strong>Waiver.</strong> No failure or delay in exercising a right shall operate as a waiver. A single or partial exercise of a right shall not preclude any further exercise of that or any other right.</p>
          <p>26.5 <strong>Assignment.</strong> The Principal shall not assign, novate or otherwise transfer its rights or obligations without the office's prior written consent. The office may assign or novate to a successor entity carrying on the same practice without the Principal's consent.</p>
          <p>26.6 <strong>Third parties.</strong> A person who is not a party to these Terms has no right under the Contracts (Rights of Third Parties) Act 1999 to enforce any term, save for any director, officer, employee or sub-contractor of the office who is expressly entitled under clause 19 or clause 20 to enforce a right in their favour.</p>
          <p>26.7 <strong>Counterparts.</strong> Any Letter of Appointment may be executed in counterparts, each of which when executed shall be deemed an original, and all of which together shall constitute one instrument. Electronic signatures are valid.</p>
          <p>26.8 <strong>No partnership.</strong> Nothing in these Terms creates a partnership, joint venture or agency between the parties other than as expressly set out.</p>
          <p>26.9 <strong>Language.</strong> These Terms are drafted in English. Any translation is provided for convenience only. The English text shall prevail in case of inconsistency.</p>
        </section>

        <section id="contact">
          <h2>27. Contact</h2>
          <p>Questions about these Terms may be addressed to the office in writing at <a href="mailto:office@acmarine.com" class="text-brass-deep underline underline-offset-4">office@acmarine.com</a>. The office aims to acknowledge written correspondence within two (2) working days.</p>
        </section>
      </article>
    </main>
  </div>
</template>

<style scoped>
.legal h2 {
  font-family: 'Cormorant Garamond', Georgia, serif;
  color: #0a1e3a;
  font-size: clamp(1.25rem, 2.6vw, 1.55rem);
  line-height: 1.25;
  margin: 0 0 0.9rem;
  letter-spacing: -0.005em;
}
.legal section + section { margin-top: 2rem; }
.legal p { margin-bottom: 0.9rem; }
.legal a { color: #7a5e30; text-decoration: underline; text-underline-offset: 3px; }
</style>
