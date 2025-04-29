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
            <div className={styles.input_div}>
              <i class="bi bi-search"></i>
              <input name='search' placeholder='სამუშაო' type="text" />
              <div className={styles.linee}></div>
              <button>ძებნა</button>
            </div>
          </div>
        </div>
        <img src="/hero.svg" alt="hero" />
      </section>
      <div className={styles.popular_jobs}>
        <div className={styles.popular_header}>
          <h1>პოპულარული</h1>
          <a href="#">ნახე ყველა <i class="bi bi-arrow-right"></i></a>
        </div>
        <div className={styles.popular_cards_div}>
          <div className={styles.popular_card}>
            <div className={styles.popular_icon}>
              <i class="bi bi-brush"></i>
            </div>
            <div className={styles.popular_text}>
              <p>გრაფიკული დიზაინი</p>
              <span>1 სამუშაო</span>
            </div>
          </div>

          <div className={styles.popular_card}>
            <div className={styles.popular_icon}>
            <i class="bi bi-code-slash"></i>
            </div>
            <div className={styles.popular_text}>
              <p>დეველოპერი</p>
              <span>12 სამუშაო</span>
            </div>
          </div>

          <div className={styles.popular_card}>
            <div className={styles.popular_icon}>
            <i class="bi bi-megaphone"></i>
            </div>
            <div className={styles.popular_text}>
              <p>ციფრული მარკეტინგი</p>
              <span>10 სამუშაო</span>
            </div>
          </div>

          <div className={styles.popular_card}>
            <div className={styles.popular_icon}>
            <i class="bi bi-camera-reels"></i>
            </div>
            <div className={styles.popular_text}>
              <p>ვიდეომონტაჟი</p>
              <span>10 სამუშაო</span>
            </div>
          </div>

          <div className={styles.popular_card}>
            <div className={styles.popular_icon}>
            <i class="bi bi-music-note-beamed"></i>
            </div>
            <div className={styles.popular_text}>
              <p>მუსიკა</p>
              <span>100 სამუშაო</span>
            </div>
          </div>

          <div className={styles.popular_card}>
            <div className={styles.popular_icon}>
            <i class="bi bi-bar-chart-line"></i>
            </div>
            <div className={styles.popular_text}>
              <p>ფინანსები</p>
              <span>21 სამუშაო</span>
            </div>
          </div>

          <div className={styles.popular_card}>
            <div className={styles.popular_icon}>
            <i class="bi bi-heart-pulse"></i>
            </div>
            <div className={styles.popular_text}>
              <p>ჯანმრთელობა</p>
              <span>8 სამუშაო</span>
            </div>
          </div>

          <div className={styles.popular_card}>
            <div className={styles.popular_icon}>
            <i class="bi bi-database"></i>
            </div>
            <div className={styles.popular_text}>
              <p>მონაცემთა ანალიზი</p>
              <span>15 სამუშაო</span>
            </div>
          </div>

        </div>
      </div>

      <div className={styles.pro_web}>
          <div className={styles.pro_text}>
            <h1>პროფესიული ქსელი</h1>
            <h2>დაამყარეთ კავშირები და განავითარეთ თქვენი პროფესიული პორტფოლიო.</h2>
          </div>
          <div className={styles.pro_list}>
            <div className={styles.pro_list_row}>
              <i class="bi bi-person-circle"></i>
            </div>
            <div className={styles.pro_list_row}>
              <i class="bi bi-person-circle"></i>
            </div>
            <div className={styles.pro_list_row}>
              <i class="bi bi-person-circle"></i>
            </div>
            <div className={styles.pro_list_row}>
              <i class="bi bi-person-circle"></i>
            </div>
            <div className={styles.pro_list_row}>
              <i class="bi bi-person-circle"></i>
            </div>
          </div>
      </div>

      <Footer />
    </>
  );
}
