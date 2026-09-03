// Teaching content shown in the Trinity boxes on the About page.
// Each person of the Trinity has two short headings with a paragraph
// and verse references. Headings are colored per-person (amber for
// the Father, rose for the Son, emerald for the Holy Spirit); verse
// references are shown in cyan so they stand out consistently from
// the headings.

const H = ({ color, children }) => (
  <h3 className={`font-bold text-lg underline decoration-2 mb-2 ${color}`}>
    {children}
  </h3>
);

const V = ({ children }) => (
  <span className="text-cyan-300 font-medium">{children}</span>
);

export const TRINITY_CONTENT = {
  father: {
    en: (
      <>
        <H color="text-amber-300 decoration-amber-400">Creator of Heaven and Earth</H>
        <p className="text-slate-200 mb-5 leading-7">
          In the beginning, God created the heavens and the earth, and everything
          that exists was made through Him and for His glory. He is the source of
          all life, holding the whole universe together by His power.{" "}
          (<V>Genesis 1:1</V>, <V>Colossians 1:16</V>)
        </p>
        <H color="text-amber-300 decoration-amber-400">Our Heavenly Father</H>
        <p className="text-slate-200 leading-7">
          God is not distant — He calls those who believe in Him His own children,
          and loves them with a Father's tender care. Jesus taught us to come to
          Him simply, saying "Our Father in heaven."{" "}
          (<V>Matthew 6:9</V>, <V>1 John 3:1</V>)
        </p>
      </>
    ),
    fr: (
      <>
        <H color="text-amber-300 decoration-amber-400">Créateur des Cieux et de la Terre</H>
        <p className="text-slate-200 mb-5 leading-7">
          Au commencement, Dieu créa les cieux et la terre, et tout ce qui existe a
          été fait par Lui et pour Sa gloire. Il est la source de toute vie et
          soutient l'univers entier par Sa puissance.{" "}
          (<V>Genèse 1:1</V>, <V>Colossiens 1:16</V>)
        </p>
        <H color="text-amber-300 decoration-amber-400">Notre Père Céleste</H>
        <p className="text-slate-200 leading-7">
          Dieu n'est pas distant — Il appelle Ses enfants ceux qui croient en Lui,
          et les aime avec la tendresse d'un Père parfait. Jésus nous a appris à
          venir à Lui simplement, en disant « Notre Père qui es aux cieux ».{" "}
          (<V>Matthieu 6:9</V>, <V>1 Jean 3:1</V>)
        </p>
      </>
    ),
    sw: (
      <>
        <H color="text-amber-300 decoration-amber-400">Muumba wa Mbingu na Dunia</H>
        <p className="text-slate-200 mb-5 leading-7">
          Hapo mwanzo, Mungu aliumba mbingu na dunia, na kila kitu kilichopo
          kiliumbwa kupitia Yeye na kwa utukufu Wake. Yeye ndiye chanzo cha uzima
          wote na hushikilia ulimwengu wote kwa nguvu Yake.{" "}
          (<V>Mwanzo 1:1</V>, <V>Wakolosai 1:16</V>)
        </p>
        <H color="text-amber-300 decoration-amber-400">Baba Yetu wa Mbinguni</H>
        <p className="text-slate-200 leading-7">
          Mungu si mbali nasi — Anawaita wale wanaomwamini watoto Wake, na
          kuwapenda kwa upendo wa Baba mkamilifu. Yesu alitufundisha kuja kwake
          kwa unyenyekevu, akisema "Baba yetu uliye mbinguni."{" "}
          (<V>Mathayo 6:9</V>, <V>1 Yohana 3:1</V>)
        </p>
      </>
    ),
  },

  son: {
    en: (
      <>
        <H color="text-rose-300 decoration-rose-400">The Word Made Flesh</H>
        <p className="text-slate-200 mb-5 leading-7">
          The Son is the eternal Word of God, who was with God and was God from
          the very beginning. He became fully human, living among us so that we
          could see the Father's glory and grace.{" "}
          (<V>John 1:1</V>, <V>John 1:14</V>)
        </p>
        <H color="text-rose-300 decoration-rose-400">Our Savior</H>
        <p className="text-slate-200 leading-7">
          God so loved the world that He gave His only Son, so that everyone who
          believes in Him would not perish but have everlasting life. There is
          salvation in no one else.{" "}
          (<V>John 3:16</V>, <V>Acts 4:12</V>)
        </p>
      </>
    ),
    fr: (
      <>
        <H color="text-rose-300 decoration-rose-400">La Parole faite Chair</H>
        <p className="text-slate-200 mb-5 leading-7">
          Le Fils est la Parole éternelle de Dieu, qui était avec Dieu et qui
          était Dieu dès le commencement. Il est devenu pleinement humain, vivant
          parmi nous afin que nous puissions voir la gloire et la grâce du Père.{" "}
          (<V>Jean 1:1</V>, <V>Jean 1:14</V>)
        </p>
        <H color="text-rose-300 decoration-rose-400">Notre Sauveur</H>
        <p className="text-slate-200 leading-7">
          Dieu a tant aimé le monde qu'Il a donné Son Fils unique, afin que
          quiconque croit en Lui ne périsse point mais ait la vie éternelle. Il
          n'y a de salut en aucun autre.{" "}
          (<V>Jean 3:16</V>, <V>Actes 4:12</V>)
        </p>
      </>
    ),
    sw: (
      <>
        <H color="text-rose-300 decoration-rose-400">Neno Alilokuwa Mwili</H>
        <p className="text-slate-200 mb-5 leading-7">
          Mwana ni Neno la milele la Mungu, aliyekuwako pamoja na Mungu na alikuwa
          Mungu tangu mwanzo. Alifanyika mwanadamu kamili, akiishi kati yetu ili
          tuweze kuona utukufu na neema ya Baba.{" "}
          (<V>Yohana 1:1</V>, <V>Yohana 1:14</V>)
        </p>
        <H color="text-rose-300 decoration-rose-400">Mwokozi Wetu</H>
        <p className="text-slate-200 leading-7">
          Mungu aliupenda ulimwengu hivi kwamba alimtoa Mwanawe wa pekee, ili kila
          mtu amwaminiye asipotee bali awe na uzima wa milele. Hakuna wokovu kwa
          mtu mwingine yeyote.{" "}
          (<V>Yohana 3:16</V>, <V>Matendo 4:12</V>)
        </p>
      </>
    ),
  },

  spirit: {
    en: (
      <>
        <H color="text-emerald-300 decoration-emerald-400">The Helper</H>
        <p className="text-slate-200 mb-5 leading-7">
          Jesus promised His disciples that the Father would send the Holy Spirit
          to teach them, remind them of His words, and never leave them alone.{" "}
          (<V>John 14:26</V>, <V>Acts 1:8</V>)
        </p>
        <H color="text-emerald-300 decoration-emerald-400">The Spirit at Work in Us</H>
        <p className="text-slate-200 leading-7">
          The Holy Spirit helps us in our weakness and produces good fruit in the
          life of every believer — love, joy, peace, patience, and more.{" "}
          (<V>Romans 8:26</V>, <V>Galatians 5:22</V>)
        </p>
      </>
    ),
    fr: (
      <>
        <H color="text-emerald-300 decoration-emerald-400">Le Consolateur</H>
        <p className="text-slate-200 mb-5 leading-7">
          Jésus a promis à Ses disciples que le Père enverrait le Saint-Esprit
          pour leur enseigner toutes choses, leur rappeler Ses paroles, et ne
          jamais les laisser seuls.{" "}
          (<V>Jean 14:26</V>, <V>Actes 1:8</V>)
        </p>
        <H color="text-emerald-300 decoration-emerald-400">L'Esprit à l'Œuvre en Nous</H>
        <p className="text-slate-200 leading-7">
          Le Saint-Esprit nous aide dans notre faiblesse et produit du bon fruit
          dans la vie de chaque croyant — amour, joie, paix, patience, et bien
          plus encore.{" "}
          (<V>Romains 8:26</V>, <V>Galates 5:22</V>)
        </p>
      </>
    ),
    sw: (
      <>
        <H color="text-emerald-300 decoration-emerald-400">Msaidizi</H>
        <p className="text-slate-200 mb-5 leading-7">
          Yesu aliwaahidi wanafunzi Wake kwamba Baba atatuma Roho Mtakatifu
          kuwafundisha, kuwakumbusha maneno Yake, na kutowaacha peke yao kamwe.{" "}
          (<V>Yohana 14:26</V>, <V>Matendo 1:8</V>)
        </p>
        <H color="text-emerald-300 decoration-emerald-400">Roho Anayefanya Kazi Ndani Yetu</H>
        <p className="text-slate-200 leading-7">
          Roho Mtakatifu hutusaidia katika udhaifu wetu na huzalisha matunda mema
          katika maisha ya kila muumini — upendo, furaha, amani, uvumilivu, na
          mengine mengi.{" "}
          (<V>Warumi 8:26</V>, <V>Wagalatia 5:22</V>)
        </p>
      </>
    ),
  },
};
