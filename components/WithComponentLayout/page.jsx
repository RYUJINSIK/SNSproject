import Footer from "../Footer/page";
import Header from "../Header/page";

function WithComponentLayout({ children }) {
  return (
    <main className="w-full max-w-[390px] h-full min-h-screen mx-auto relative bg-white shadow-xl">
      <Header />
      <div className="w-full h-full">{children}</div>
      <Footer />
    </main>
  );
}
export default WithComponentLayout;
