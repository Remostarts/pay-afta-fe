export const metadata = {
  title: 'Privacy Policy',
};

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl p-8 text-black">
      {/* Header Section */}
      <div className="mb-16">
        <h1 className="mb-2 text-4xl font-semibold tracking-tight">Privacy Policy</h1>
      </div>

      {/* Introduction */}
      <p className="mb-16 text-lg leading-relaxed">
        Welcome to PayAfta, an escrow and secure transaction platform operated by CashiaTech Nigeria
        Limited (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). Your privacy is important to
        us, and we are committed to protecting your data in compliance with applicable data
        protection laws.
      </p>

      {/* Privacy Policy Sections */}
      <div className="space-y-8">
        {/* Section 1 */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">1. Information We Collect</h2>
          <div className="space-y-4 pl-6 text-lg leading-relaxed">
            <p>
              1.1 Personal details: Name, email, phone number, address, and government-issued ID for
              verification.
            </p>
            <p>1.2 Financial data: Bank details for payment processing.</p>
            <p>1.3 Transactional data: Details of payments and escrow agreements.</p>
            <p>
              1.4 Technical data: IP addresses, device information, and AI-generated usage
              analytics.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">2. How We Use Your Data</h2>
          <div className="space-y-4 pl-6 text-lg leading-relaxed">
            <p>2.1 To facilitate secure transactions and escrow services.</p>
            <p>2.2 To comply with legal obligations, including KYC and AML regulations.</p>
            <p>2.3 To improve our AI-driven fraud detection and customer support features.</p>
            <p>2.4 To send service-related notifications and updates.</p>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">3. Data Sharing & Security</h2>
          <div className="space-y-4 pl-6 text-lg leading-relaxed">
            <p>3.1 We do not sell or rent your data.</p>
            <p>
              3.2 We may share necessary information with banking partners, regulatory authorities,
              or fraud prevention agencies.
            </p>
            <p>3.3 We implement encryption and security measures to protect your data.</p>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">4.User Rights</h2>
          <div className="space-y-4 pl-6 text-lg leading-relaxed">
            <p>4.1 Access, update, or delete your data.</p>
            <p>4.2 Object to AI-based processing of your data.</p>
            <p>
              4.3 Request data portability or report concerns to local data protection authorities.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">5. Changes to this Policy</h2>
          <div className="pl-6">
            <p className="text-lg leading-relaxed">
              We may update this policy as required. Users will be notified of significant changes.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        {/* <section>
            <h2 className="mb-3 text-2xl font-semibold">6. Children&apos;s Privacy</h2>
            <div className="pl-6">
              <p className="text-lg leading-relaxed">
                6.1 The Platform is not directed to individuals under the age of 18. If you become
                aware that a child has provided us with personal information, please contact us, and
                we will take steps to delete such information.
              </p>
            </div>
          </section> */}

        {/* Section 7 */}
        {/* <section>
            <h2 className="mb-3 text-2xl font-semibold">7. Changes to this Privacy Policy</h2>
            <div className="pl-6">
              <p className="text-lg leading-relaxed">
                7.1 We may update this Privacy Policy to reflect changes in our practices or for other
                operational, legal, or regulatory reasons. We will notify you of any changes by
                posting the new Privacy Policy on the Platform.
              </p>
            </div>
          </section> */}

        {/* Section 8 */}
        {/* <section>
            <h2 className="mb-3 text-2xl font-semibold">8. Contact Information</h2>
            <div className="pl-6">
              <p className="text-lg leading-relaxed">
                If you have any questions or concerns regarding this Privacy Policy, please contact us
                at <span className="font-semibold">legal@pocketlawyers.io</span>
              </p>
            </div>
          </section>
        </div> */}

        {/* Footer
        <div className="mt-16 font-semibold">Thank you for using PocketLawyers!</div> */}
      </div>
    </div>
  );
}
