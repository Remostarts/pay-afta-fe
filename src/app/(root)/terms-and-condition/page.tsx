export const metadata = {
  title: 'Terms and Conditions',
};

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl p-8 text-black">
      {/* Header Section */}
      <div className="mb-16">
        <h1 className="mb-2 text-4xl font-semibold tracking-tight">Terms and Conditions</h1>
      </div>

      {/* Introduction */}
      <p className="mb-16 text-lg leading-relaxed">
        These Terms & Conditions (&quot;T&C&quot;) govern your use of PayAfta. By accessing our
        platform, you agree to these terms. If you disagree, do not use PayAfta.
      </p>

      {/* Terms and Conditions Sections */}
      <div className="space-y-8">
        {/* Section 1 */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">1. Scope of Service</h2>
          <div className="space-y-4 pl-6 text-lg leading-relaxed">
            <p>
              PayAfta acts as a neutral escrow intermediary between buyers and sellers. We do not
              hold funds but facilitate their secure transfer through partnered financial
              institutions.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">2. User Responsibilities</h2>
          <div className="space-y-4 pl-6 text-lg leading-relaxed">
            <p>2.1 Users must provide accurate information and comply with KYC/AML regulations.</p>
            <p>2.2 Transactions must not involve illegal, fraudulent, or prohibited items.</p>
            <p>2.3 Users must not attempt to bypass the escrow process.</p>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">3. Fees & Payment Terms</h2>
          <div className="space-y-4 pl-6 text-lg leading-relaxed">
            <p>
              3.1 Service fees apply per transaction and will be displayed before confirming escrow
              agreements.
            </p>
            <p>3.2 Payments are processed via our banking partners.</p>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">4. Dispute Resolution</h2>
          <div className="space-y-4 pl-6 text-lg leading-relaxed">
            <p>4.1 Disputes must be reported via our dispute resolution center.</p>
            <p>4.2 PayAfta reserves the right to mediate or involve third-party arbitrators.</p>
          </div>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">5. Limitations of Liability</h2>
          <div className="space-y-4 pl-6 text-lg leading-relaxed">
            <p>
              5.1 PayAfta is not liable for losses due to user negligence, fraud, or unauthorized
              access.
            </p>
            <p>
              5.2 In no event shall PayAfta be responsible for indirect damages, including loss of
              profits.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">6. Termination & Suspension</h2>
          <div className="space-y-4 pl-6 text-lg leading-relaxed">
            <p>
              6.1 We reserve the right to suspend or terminate accounts engaged in suspicious
              activities.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">7. Governing Law</h2>
          <div className="space-y-4 pl-6 text-lg leading-relaxed">
            <p>
              7.1 These T&C are governed by Nigerian law, with disputes subject to arbitration in
              Lagos, Nigeria.
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
