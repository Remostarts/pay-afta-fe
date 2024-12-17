import Image from 'next/image';

export default function CardRepresentation() {
  return (
    <section className=" p-3">
      <Image
        src="/assets/dashboard/VirtualCard/blank-card.svg"
        alt="virtual card"
        width={400}
        height={400}
      />
    </section>
  );
}
