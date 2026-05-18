<script setup lang="ts">
useSeoMeta({
  title: 'Privacy Notice. Aldridge & Charles Marine.',
  description: 'Privacy notice setting out how Aldridge & Charles Marine handles personal information of principals, prospective clients, crew candidates and site visitors.',
})
useHead({ link: [{ rel: 'canonical', href: 'https://acmarine.co/privacy' }] })

const sections = [
  { id: 'about', title: 'About this notice' },
  { id: 'controller', title: 'Who we are' },
  { id: 'data', title: 'Personal information we collect' },
  { id: 'sources', title: 'How we collect it' },
  { id: 'purposes', title: 'Why we use it and our legal bases' },
  { id: 'special', title: 'Special category data' },
  { id: 'recipients', title: 'Recipients of your information' },
  { id: 'international', title: 'International transfers' },
  { id: 'retention', title: 'How long we keep it' },
  { id: 'security', title: 'How we protect it' },
  { id: 'rights', title: 'Your rights' },
  { id: 'marketing', title: 'Marketing communications' },
  { id: 'cookies', title: 'Cookies and similar technologies' },
  { id: 'children', title: 'Children' },
  { id: 'changes', title: 'Changes to this notice' },
  { id: 'contact', title: 'Contact and complaints' },
]
</script>

<template>
  <div class="px-4 md:px-6">
    <main class="container mx-auto max-w-[820px] py-10 md:py-16">
      <p class="eyebrow">Privacy</p>
      <h1 class="font-serif text-navy mt-3 mb-2" style="font-size: clamp(2.4rem, 6vw, 4rem); line-height: 1.05">Privacy notice.</h1>
      <p class="text-xs uppercase tracking-widest text-ink/50 mb-8">Effective 17 May 2026.</p>

      <p class="text-base md:text-lg leading-relaxed text-ink/82 mb-8">
        Aldridge &amp; Charles Marine (the "office", "we", "us", "our") takes the protection of personal information seriously. This notice explains what personal information we collect, why we collect it, who we share it with, how long we keep it, and the rights you have in relation to your information. It applies to principals, prospective clients, beneficial owners, crew candidates, business referrers, vendors and visitors to this site.
      </p>
      <p class="text-base md:text-lg leading-relaxed text-ink/82 mb-12">
        Where additional or different rules apply to a particular service (such as the placement of crew, or anti-money laundering checks for a brokerage engagement), those rules are summarised in the relevant section below or in the engagement letter we provide.
      </p>

      <nav class="border border-rule bg-white/60 p-6 mb-12" aria-label="Contents">
        <p class="eyebrow mb-3">Contents</p>
        <ol class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm font-serif text-navy">
          <li v-for="(s, i) in sections" :key="s.id"><a :href="`#${s.id}`" class="hover:text-brass-deep transition-colors">{{ i + 1 }}. {{ s.title }}</a></li>
        </ol>
      </nav>

      <article class="legal space-y-12 text-base md:text-[1.04rem] leading-[1.78] text-ink/86">

        <section id="about">
          <h2>1. About this notice</h2>
          <p>1.1 This notice sets out the practices of the office in respect of personal information processed in connection with our services and this site. It is written with reference to the EU General Data Protection Regulation (Regulation (EU) 2016/679, "GDPR"), the UK General Data Protection Regulation as it forms part of domestic law in the United Kingdom by virtue of the European Union (Withdrawal) Act 2018 ("UK GDPR"), the Data Protection Act 2018, the California Consumer Privacy Act of 2018 as amended by the California Privacy Rights Act ("CCPA/CPRA") to the extent applicable to residents of California, and other applicable privacy and data protection laws of the jurisdictions in which we operate.</p>
          <p>1.2 The terms used in this notice carry the meanings given to them in the GDPR and the UK GDPR. "Personal information" includes "personal data" within the meaning of those instruments and "personal information" within the meaning of the CCPA/CPRA.</p>
          <p>1.3 We may provide more specific information at the point we collect particular information from you (sometimes called a "just-in-time" notice). Where there is any conflict between this general notice and a just-in-time notice issued in respect of a specific collection, the just-in-time notice prevails.</p>
        </section>

        <section id="controller">
          <h2>2. Who we are</h2>
          <p>2.1 The office is the controller in respect of the personal information described in this notice. Correspondence on data protection matters may be addressed to:</p>
          <ul class="list-disc pl-6 space-y-1">
            <li><strong>Email:</strong> <a href="mailto:office@acmarine.co" class="text-brass-deep underline underline-offset-4">office@acmarine.co</a></li>
            <li><strong>Subject line:</strong> "Data Protection"</li>
          </ul>
          <p>2.2 Where the office is required by Applicable Law to appoint a representative in the European Union or the United Kingdom, that representative's details will be made available on request.</p>
          <p>2.3 In certain engagements we may act as a processor on behalf of a principal who is the controller (for example, where the office administers crew payroll on the principal's instructions). The data-processing arrangements for those engagements are governed by the relevant engagement letter and any required data-processing agreement.</p>
        </section>

        <section id="data">
          <h2>3. Personal information we collect</h2>
          <p>3.1 We collect personal information that is reasonably necessary to deliver our services, satisfy our regulatory and professional obligations, manage our relationships with you, and operate this site. The categories of information we collect include the following:</p>
          <p>3.2 <strong>Identity and contact information.</strong> Full legal name, preferred name, title, date of birth, nationality, passport or identity-document number and copy, residential and correspondence addresses, telephone numbers, email addresses, and (in respect of corporate principals) the equivalent details of directors, officers, beneficial owners, settlors, trustees and authorised signatories.</p>
          <p>3.3 <strong>Onboarding and due-diligence information.</strong> Proof of address documents, source-of-funds and source-of-wealth declarations and supporting evidence, ownership structure documentation, tax-residence information, politically-exposed-person screening outcomes, sanctions screening outcomes, and adverse-media screening outcomes.</p>
          <p>3.4 <strong>Vessel and operational information.</strong> Vessel name, hull and IMO numbers, MMSI, flag, registry data, classification status, photographs, technical specifications, maintenance history, insurance details, certificates and surveys, log entries, port-call records, fuel and provisioning records, and information relating to charters undertaken.</p>
          <p>3.5 <strong>Crew information.</strong> In relation to crew candidates and crew engaged on a principal's vessel under our management, we may process curricula vitae, certifications (including STCW, GMDSS, AEC and other competency certificates), seafarer's medical fitness certificate (ENG1 or equivalent), references, prior service records, photographs, passport copies, visas and immigration documentation, training records, employment contracts, payroll information, performance and disciplinary records, and emergency contact details.</p>
          <p>3.6 <strong>Financial information.</strong> Bank account details, escrow instructions, transaction records, retainer payment history, deposit records, advance provisioning allowance accounts, and similar.</p>
          <p>3.7 <strong>Correspondence and engagement records.</strong> Letters, emails, meeting notes, telephone-call summaries, instructions, advice given, deliverables produced, and the records required by Applicable Law and professional standards to demonstrate the work undertaken.</p>
          <p>3.8 <strong>Site information.</strong> When you visit this site, our infrastructure providers automatically record limited technical information about your visit, including your internet protocol (IP) address (in truncated form where feasible), user-agent string, request method and path, response status, referrer and request time. This information is used to detect abuse, maintain security and produce aggregated traffic statistics, and is retained for short periods only.</p>
          <p>3.9 <strong>Inquiry-form submissions.</strong> When you submit an inquiry through this site, we receive the name, email address and message you provide, together with the slug of any vessel listing you are inquiring about. We do not collect any further information through the site itself.</p>
        </section>

        <section id="sources">
          <h2>4. How we collect it</h2>
          <p>4.1 We collect personal information from the following sources:</p>
          <p>(a) <strong>Directly from you,</strong> when you contact us, complete the inquiry form, attend a meeting, enter into a letter of appointment, provide identity documents and supporting materials, or otherwise communicate with us.</p>
          <p>(b) <strong>From referrers,</strong> including existing principals, captains, lawyers, accountants and brokers who introduce you to the office in confidence.</p>
          <p>(c) <strong>From public sources,</strong> including registers of companies, registers of vessels, classification-society records, court and insolvency records, news media and licensed databases.</p>
          <p>(d) <strong>From specialist screening providers,</strong> who supply us with sanctions, politically-exposed-person and adverse-media data drawn from public, official and proprietary sources, for the purposes of anti-money laundering and compliance.</p>
          <p>(e) <strong>From counter-parties and authorities</strong> involved in a transaction or operation (for example, opposing brokers, yards, surveyors, classification societies, flag administrations, port authorities, customs, marinas, insurers and underwriters), where they share information that is necessary for the conduct of the engagement.</p>
        </section>

        <section id="purposes">
          <h2>5. Why we use it and our legal bases</h2>
          <p>5.1 We use personal information for the purposes set out below. Under the GDPR and the UK GDPR, each use is supported by one or more of the following legal bases: (i) performance of a contract or steps prior to entering into a contract; (ii) compliance with a legal obligation; (iii) our legitimate interests (or those of a third party), where these are not overridden by your interests, rights and freedoms; (iv) your consent, where required; and (v) the establishment, exercise or defence of legal claims.</p>
          <p>5.2 <strong>To provide our services,</strong> including evaluating, accepting and operating engagements; communicating with principals; preparing reports, advice and deliverables; coordinating with third parties on a principal's behalf; and administering retainers and disbursements. (Legal bases: contract; legitimate interests in operating an effective professional practice.)</p>
          <p>5.3 <strong>To comply with our legal and regulatory obligations,</strong> including customer due diligence, ongoing monitoring, sanctions screening, anti-bribery checks, tax reporting (such as the Foreign Account Tax Compliance Act and the Common Reporting Standard, to the extent applicable), responding to lawful requests by competent authorities and assisting investigations. (Legal bases: legal obligation; legitimate interests in compliance and risk management.)</p>
          <p>5.4 <strong>To establish, exercise and defend legal claims,</strong> including managing disputes, claims, arbitrations, court proceedings and insurance matters. (Legal bases: legitimate interests; legal claims.)</p>
          <p>5.5 <strong>To run our practice,</strong> including bookkeeping, audit, professional indemnity insurance, training, business continuity, conflicts management and quality assurance. (Legal bases: legitimate interests; legal obligation, where applicable.)</p>
          <p>5.6 <strong>For crew placement,</strong> we use crew candidates' information to assess suitability for vessels, present candidates to principals (in identifiable form, with consent), verify certifications at source, arrange interviews, and (where placed) assist a principal in administering crew matters in accordance with applicable maritime employment regulations. (Legal bases: pre-contractual steps and contract; legitimate interests in operating a curated crew network; legal obligation in respect of certifications and right-to-work checks.)</p>
          <p>5.7 <strong>For security and abuse prevention</strong> on this site and our infrastructure. (Legal basis: legitimate interests in operating a secure service.)</p>
        </section>

        <section id="special">
          <h2>6. Special category data</h2>
          <p>6.1 The GDPR and the UK GDPR define certain types of personal information as "special category data" requiring additional protection. The office does not seek special category data save where directly relevant to a crew engagement (for example, a seafarer's medical fitness certificate, which evidences general fitness for sea service) or where a principal voluntarily provides such information in the course of a sensitive matter.</p>
          <p>6.2 Where we process special category data, we do so on the basis of an exception in Article 9 of the GDPR (or the equivalent provision of the UK GDPR), most commonly the establishment, exercise or defence of legal claims, the protection of vital interests, employment, social-security and social-protection law obligations, or your explicit consent.</p>
          <p>6.3 We do not seek or knowingly process personal information about a person's criminal convictions or offences other than via the regulated sanctions, politically-exposed-person and adverse-media screening described above, and in each case on the basis of legitimate interests and applicable derogations for anti-money laundering and fraud prevention.</p>
        </section>

        <section id="recipients">
          <h2>7. Recipients of your information</h2>
          <p>7.1 We share personal information with the following categories of recipient on a need-to-know basis and with appropriate confidentiality protections:</p>
          <ul class="list-disc pl-6 space-y-1">
            <li>Members of the office bound by confidentiality obligations.</li>
            <li>Independent professional advisers (lawyers, accountants, tax advisers, naval architects, marine engineers, surveyors) instructed in connection with an engagement.</li>
            <li>Counter-parties and their advisers in transactions, charters or refits we coordinate.</li>
            <li>Banks, payment-service providers, escrow agents and insurance brokers and underwriters.</li>
            <li>Yards, marinas, port agents, customs agents and provisioners.</li>
            <li>Classification societies, flag administrations and port-state authorities.</li>
            <li>Specialist providers of sanctions, politically-exposed-person, adverse-media and identity-verification services, operating under our written instructions.</li>
            <li>Hosting, security and communications providers operating the digital and physical infrastructure of the office, operating under written agreements that restrict their use of personal information to the provision of those services and that include appropriate security and confidentiality undertakings.</li>
            <li>Acquirers or potential acquirers of all or part of the office's business or assets, in connection with a corporate transaction, restructuring or reorganisation, on customary confidentiality terms.</li>
            <li>Competent authorities (including tax, regulatory, law-enforcement and judicial authorities), where required by Applicable Law, court order, subpoena or analogous lawful request.</li>
          </ul>
          <p>7.2 We do not sell, rent or barter personal information. We do not engage in cross-context behavioural advertising. We do not allow third parties to use personal information collected through this site for their own advertising or analytics purposes.</p>
        </section>

        <section id="international">
          <h2>8. International transfers</h2>
          <p>8.1 The office operates internationally. Personal information may be transferred to, and processed in, jurisdictions outside the European Economic Area, the United Kingdom and Switzerland, including where principals, vessels, counter-parties, advisers or recipients listed at clause 7 are located outside those jurisdictions.</p>
          <p>8.2 Where a transfer is made to a jurisdiction that does not benefit from an adequacy decision under the GDPR or the UK GDPR, we rely on appropriate safeguards, including the European Commission's Standard Contractual Clauses, the UK International Data Transfer Agreement or UK Addendum, and supplementary measures where appropriate. Copies of the relevant clauses are available on written request, subject to redaction of commercially sensitive information.</p>
          <p>8.3 In limited circumstances we may rely on a derogation under Article 49 of the GDPR (or the equivalent provision of the UK GDPR), such as where the transfer is necessary for the performance of a contract concluded in your interest, for the establishment, exercise or defence of legal claims, or where you have given explicit consent.</p>
        </section>

        <section id="retention">
          <h2>9. How long we keep it</h2>
          <p>9.1 We keep personal information only for as long as is necessary for the purposes for which it was collected, subject to retention obligations imposed by Applicable Law, the requirements of professional indemnity insurers, and our legitimate interests in establishing, exercising and defending legal claims.</p>
          <p>9.2 Indicative retention periods are as follows. The periods stated start from the closing of the relevant engagement or other relevant trigger event.</p>
          <ul class="list-disc pl-6 space-y-1">
            <li><strong>Engagement files,</strong> including correspondence, instructions and deliverables: typically seven (7) years, consistent with maritime professional convention and limitation periods.</li>
            <li><strong>Anti-money-laundering records,</strong> including identification documentation and due-diligence outputs: typically five (5) years, or longer where Applicable Law so requires.</li>
            <li><strong>Brokerage transaction files,</strong> including MOAs, sale documentation and commission records: typically seven (7) years.</li>
            <li><strong>Crew placement files,</strong> including candidate cv, certifications and references: typically three (3) years from the last interaction with the candidate, longer where the candidate has been placed.</li>
            <li><strong>Inquiry-form submissions:</strong> until the matter is closed, and then for a further two (2) years for legitimate-interest purposes, unless you ask for earlier deletion.</li>
            <li><strong>Site technical logs:</strong> typically ninety (90) days, longer where retention is necessary to investigate a specific security incident.</li>
            <li><strong>Bookkeeping records:</strong> as required by Applicable Law in the relevant jurisdiction (typically six (6) to ten (10) years).</li>
          </ul>
          <p>9.3 At the end of the retention period, personal information is securely deleted or anonymised. Where we retain information for legal-claim or regulatory purposes after the standard retention period, access is restricted to those with a need to know.</p>
        </section>

        <section id="security">
          <h2>10. How we protect it</h2>
          <p>10.1 The office maintains administrative, technical and physical safeguards designed to protect personal information against unauthorised or unlawful processing, accidental loss, alteration, disclosure or access. Measures include role-based access controls, multi-factor authentication for privileged systems, encryption of data in transit and at rest, vendor due diligence, written confidentiality undertakings from staff and providers, and a written incident-response procedure.</p>
          <p>10.2 No system can be guaranteed to be impervious to compromise. Where a personal-data breach occurs that meets the threshold for regulatory notification under Applicable Law, the office will notify the competent supervisory authority within the period prescribed by law, and, where appropriate, the individuals affected.</p>
          <p>10.3 We do not publish the technical details of our infrastructure on this site. Such information is made available to professional advisers, insurers and regulators on a confidential basis where they reasonably require it.</p>
        </section>

        <section id="rights">
          <h2>11. Your rights</h2>
          <p>11.1 Subject to Applicable Law, you have the following rights in relation to your personal information:</p>
          <ul class="list-disc pl-6 space-y-1">
            <li><strong>Right of access</strong> to information we hold about you and a copy of it.</li>
            <li><strong>Right to rectification</strong> of inaccurate or incomplete information.</li>
            <li><strong>Right to erasure</strong> in certain circumstances (sometimes called the "right to be forgotten").</li>
            <li><strong>Right to restrict processing</strong> in certain circumstances.</li>
            <li><strong>Right to data portability</strong> in certain circumstances.</li>
            <li><strong>Right to object</strong> to processing on the basis of our legitimate interests, and to object to direct marketing at any time.</li>
            <li><strong>Right to withdraw consent</strong> at any time where processing is based on consent (without affecting the lawfulness of processing carried out before the withdrawal).</li>
            <li><strong>Right not to be subject</strong> to a decision based solely on automated processing that produces legal or similarly significant effects concerning you. The office does not currently make any such decisions.</li>
            <li><strong>Right to lodge a complaint</strong> with a supervisory authority (see clause 16).</li>
          </ul>
          <p>11.2 Certain rights may be limited or qualified by Applicable Law. For example, we may decline a request for erasure to the extent that we are required by law, professional convention or insurance to retain information.</p>
          <p>11.3 Residents of California, Colorado, Connecticut, Virginia, Utah and other US states with comprehensive privacy laws may have additional or differently formulated rights, including the right to opt out of "sale" and "sharing" of personal information (we do not engage in either), the right to limit the use of sensitive personal information (we collect only what is necessary for the engagement), and the right to non-discrimination for exercising rights. To exercise any of those rights, please use the contact details at clause 16.</p>
          <p>11.4 To exercise any right, please write to <a href="mailto:office@acmarine.co" class="text-brass-deep underline underline-offset-4">office@acmarine.co</a> with the subject line "Data Protection". We may need to verify your identity before acting on a request. We will respond within one (1) month or, where the request is complex or numerous, within such longer period as Applicable Law permits, having notified you of the extension.</p>
        </section>

        <section id="marketing">
          <h2>12. Marketing communications</h2>
          <p>12.1 The office does not conduct marketing campaigns and does not maintain a marketing mailing list. We may from time to time write to existing principals about matters relevant to their engagement, or to known referrers about industry matters where we have a legitimate interest in doing so. You may unsubscribe from such communications at any time by replying with the word "unsubscribe" or by writing to the office.</p>
        </section>

        <section id="cookies">
          <h2>13. Cookies and similar technologies</h2>
          <p>13.1 This site uses a small number of cookies and similar technologies for purposes that are essential to its operation, such as maintaining the state of the inquiry form during a single visit and securing any administrative session. We do not use third-party advertising cookies. We do not embed third-party social-media trackers. We do not currently use third-party analytics services on this site.</p>
          <p>13.2 You can configure your browser to refuse cookies. If you do so, the site will continue to function for browsing purposes, but some interactive features (such as the inquiry form) may not work as intended.</p>
        </section>

        <section id="children">
          <h2>14. Children</h2>
          <p>14.1 Our services are intended for sophisticated adult clients and their professional advisers. The site is not directed at, and is not intended to be used by, children. We do not knowingly collect personal information about children. If you believe a child has provided personal information to us, please write to the office and we will take steps to delete it.</p>
        </section>

        <section id="changes">
          <h2>15. Changes to this notice</h2>
          <p>15.1 We may update this notice from time to time to reflect changes in our practices, our services, our infrastructure providers, or Applicable Law. The current version, and the effective date, are published on this page. Material changes will be brought to your attention where Applicable Law so requires.</p>
        </section>

        <section id="contact">
          <h2>16. Contact and complaints</h2>
          <p>16.1 Questions, requests and complaints about this notice or our processing of personal information may be addressed to <a href="mailto:office@acmarine.co" class="text-brass-deep underline underline-offset-4">office@acmarine.co</a> with the subject line "Data Protection".</p>
          <p>16.2 You have the right to lodge a complaint with a supervisory authority for data protection. In the United Kingdom, the supervisory authority is the Information Commissioner's Office (<a href="https://ico.org.uk" class="text-brass-deep underline underline-offset-4">ico.org.uk</a>). In the European Union, the relevant authority is the data protection authority of the member state in which you are habitually resident, in which you work, or in which the alleged infringement occurred. We would, however, appreciate the chance to address your concern before you approach the supervisory authority.</p>
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
