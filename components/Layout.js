import Footer from "@/components/Footer";

export default function Layout({ children }) {

  return (
    <div>
      <title>E-view</title>
      <div className="mb-28">{children}</div>
      <Footer />
    </div>
  );
}
