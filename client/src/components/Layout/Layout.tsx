import { Header } from '@components/Header';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-3xl p-4 mx-auto">
      <Header />
      <div className="pt-4">{children}</div>
    </div>
  );
};
