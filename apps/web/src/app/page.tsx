export default function HomePage() {
  return (
    <main className="home-page container py-5">
      <div className="row">
        <div className="col-12 col-lg-8">
          <section className="home-page__intro p-4 p-md-5" aria-labelledby="home-title">
            <h1 id="home-title" className="home-page__title h2 mb-3">
              Orders &amp; Products
            </h1>
            <p className="mb-0">Приложение учёта приходов и товаров.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
