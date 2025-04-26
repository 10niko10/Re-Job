import Header from './components/Header/Header'
import styles from './page.module.css'
import Link from 'next/link';
import Footer from './components/Footer/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <section className={styles.hero}>
        <div className={styles.hero_div}>
          <div className={styles.hero_text}>
            <h1>შენი უნარები</h1>
            <h2>შენი წარმატებაა </h2>
            <p>დაუკავშირდით საუკეთესო კლიენტებს და აჩვენეთ თქვენი პროფესიული გამოცდილება</p>
          </div>
        </div>
        <img src="/hero.svg" alt="hero" />
      </section>
      <div className={styles.popular_jobs}>
        <div className={styles.popular_header}>
          <h3>პოპულარული</h3>
          <a href="#">ნახე ყველა <i class="bi bi-arrow-right"></i></a>
        </div>
        <div className={styles.popular_cards_div}>
          <div className={styles.popular_cards}>
            <div className={styles.popular_icon}>
              <i class="bi bi-brush"></i>
            </div>
            
          </div>
        </div>
      </div>


      <Footer />
    </>
  );
}
