import Footer from '@/components/view/root/shared/Footer';
import Navbar from '@/components/view/root/shared/navbar/Navbar';
import { TChildrenProps } from '@/types';

export default function Layout({ children }: TChildrenProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <Navbar />
      </header>

      <main>
        <section>{children}</section>
      </main>

      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}
