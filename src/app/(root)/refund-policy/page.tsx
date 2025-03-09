export const metadata = {
  title: 'Refund Policy',
};

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl p-8 text-black">
      {/* Header Section */}
      <div className="mb-16">
        <h1 className="mb-2 text-4xl font-semibold tracking-tight">Refund Policy</h1>
      </div>

      {/* Introduction */}
      <p className="mb-16 text-lg leading-relaxed">
        PayAfta facilitates secure transactions between buyers and sellers. Refunds depend on the
        escrow terms agreed upon at the start of the transaction.
      </p>

      {/* Refund Policy Sections */}
      <div className="space-y-8">
        {/* Section 1 */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">1. Conditions for Refunds</h2>
          <div className="space-y-4 pl-6 text-lg leading-relaxed">
            <p>
              1.1 Refunds will only be issued if the seller fails to deliver the agreed
              product/service.
            </p>
            <p>
              1.2 Buyers must lodge a dispute within [X] days of the transaction to qualify for a
              refund.
            </p>
            <p>1.3 Partial refunds may apply if part of the service/product is delivered.</p>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">2. Non-Refundable Cases</h2>
          <div className="space-y-4 pl-6 text-lg leading-relaxed">
            <p>2.1 Transactions completed outside of PayAfta’s escrow process.</p>
            <p>
              2.2 Digital goods, services, or custom-made products where delivery has been
              confirmed.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">3. Refund Processing Time</h2>
          <div className="space-y-4 pl-6 text-lg leading-relaxed">
            <p>
              3.1 Approved refunds will be processed within 7-14 business days through the original
              payment method.
            </p>
            <p>3.2 Bank processing times may vary.</p>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">4. Dispute Resolution</h2>
          <div className="space-y-4 pl-6 text-lg leading-relaxed">
            <p>
              4.1 Users must use PayAfta’s dispute resolution system to initiate refund requests.
            </p>
            <p>4.2 If an agreement is not reached, an independent arbitrator may be appointed.</p>
          </div>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">5. Contact Us</h2>
          <div className="pl-6">
            <p className="text-lg leading-relaxed">
              For refund inquiries, email [support@getpayafta.com] or call [+2347037817547].
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
