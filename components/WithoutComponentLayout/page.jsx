function WithoutComponentLayout({ children }) {
  return (
    <main className="w-full max-w-[390px] h-100vh min-h-screen mx-auto relative bg-white shadow-xl">
      <div className="w-full h-full bg-white">{children}</div>
    </main>
  );
}

export default WithoutComponentLayout;
