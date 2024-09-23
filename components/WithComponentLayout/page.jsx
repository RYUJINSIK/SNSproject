import Footer from "../Footer/page";
import Header from "../Header/page";

function WithComponentLayout({ children }) {
  return (
    <div className="min-h-screen flex justify-center">
      <main className="w-full max-w-[390px] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px] min-h-screen mx-auto relative bg-white shadow-xl flex flex-col">
        <Header />
        <div className="w-full flex-grow bg-white p-4 sm:p-6 md:p-20 pt-[3.5rem] pb-[3.5rem]">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default WithComponentLayout;
