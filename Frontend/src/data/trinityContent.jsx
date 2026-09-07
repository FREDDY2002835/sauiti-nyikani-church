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

  bible: {
    en: (
      <>
        <H color="text-sky-300 decoration-sky-400">The Word of God</H>
        <p className="text-slate-200 mb-5 leading-7">
          All Scripture is breathed out by God and is useful for teaching, for
          correction, and for training in righteousness, so that God's people may
          be fully equipped for every good work.{" "}
          (<V>2 Timothy 3:16-17</V>, <V>Hebrews 4:12</V>)
        </p>
        <H color="text-sky-300 decoration-sky-400">A Lamp for Our Path</H>
        <p className="text-slate-200 leading-7">
          God's Word guides and protects us in a confusing world, showing us how
          to live and giving us a hope that endures forever.{" "}
          (<V>Psalm 119:105</V>, <V>Isaiah 40:8</V>)
        </p>
      </>
    ),
    fr: (
      <>
        <H color="text-sky-300 decoration-sky-400">La Parole de Dieu</H>
        <p className="text-slate-200 mb-5 leading-7">
          Toute Écriture est inspirée de Dieu et utile pour enseigner, pour
          corriger, et pour former à la justice, afin que l'homme de Dieu soit
          accompli et propre à toute bonne œuvre.{" "}
          (<V>2 Timothée 3:16-17</V>, <V>Hébreux 4:12</V>)
        </p>
        <H color="text-sky-300 decoration-sky-400">Une Lampe sur Notre Chemin</H>
        <p className="text-slate-200 leading-7">
          La Parole de Dieu nous guide et nous protège dans un monde confus, nous
          montrant comment vivre et nous donnant une espérance qui dure toujours.{" "}
          (<V>Psaume 119:105</V>, <V>Ésaïe 40:8</V>)
        </p>
      </>
    ),
    sw: (
      <>
        <H color="text-sky-300 decoration-sky-400">Neno la Mungu</H>
        <p className="text-slate-200 mb-5 leading-7">
          Maandiko yote yamevuviwa na Mungu, na yanafaa kwa mafundisho, kwa
          kuwaonya watu makosa yao, na kwa kuwazoeza katika haki, ili mtu wa Mungu
          awe kamili, amekamilishwa apate kutenda kila tendo jema.{" "}
          (<V>2 Timotheo 3:16-17</V>, <V>Waebrania 4:12</V>)
        </p>
        <H color="text-sky-300 decoration-sky-400">Taa ya Njia Yetu</H>
        <p className="text-slate-200 leading-7">
          Neno la Mungu hutuongoza na kutulinda katika ulimwengu wenye mkanganyiko,
          likituonyesha jinsi ya kuishi na kutupa tumaini lidumulo milele.{" "}
          (<V>Zaburi 119:105</V>, <V>Isaya 40:8</V>)
        </p>
      </>
    ),
  },

  community: {
    en: (
      <>
        <H color="text-violet-300 decoration-violet-400">One Body, Many Members</H>
        <p className="text-slate-200 mb-5 leading-7">
          Believers are joined together as one body in Christ, each with
          different gifts, all needed and valued, working together for the good
          of the whole church.{" "}
          (<V>1 Corinthians 12:12</V>, <V>Romans 12:5</V>)
        </p>
        <H color="text-violet-300 decoration-violet-400">Bearing One Another's Burdens</H>
        <p className="text-slate-200 leading-7">
          We are called to meet together regularly, encourage one another, and
          carry each other's burdens in love.{" "}
          (<V>Hebrews 10:24-25</V>, <V>Galatians 6:2</V>)
        </p>
      </>
    ),
    fr: (
      <>
        <H color="text-violet-300 decoration-violet-400">Un Seul Corps, Plusieurs Membres</H>
        <p className="text-slate-200 mb-5 leading-7">
          Les croyants sont unis en un seul corps en Christ, chacun avec des dons
          différents, tous nécessaires et précieux, œuvrant ensemble pour le bien
          de toute l'Église.{" "}
          (<V>1 Corinthiens 12:12</V>, <V>Romains 12:5</V>)
        </p>
        <H color="text-violet-300 decoration-violet-400">Porter les Fardeaux les Uns des Autres</H>
        <p className="text-slate-200 leading-7">
          Nous sommes appelés à nous réunir régulièrement, à nous encourager
          mutuellement, et à porter les fardeaux les uns des autres avec amour.{" "}
          (<V>Hébreux 10:24-25</V>, <V>Galates 6:2</V>)
        </p>
      </>
    ),
    sw: (
      <>
        <H color="text-violet-300 decoration-violet-400">Mwili Mmoja, Viungo Vingi</H>
        <p className="text-slate-200 mb-5 leading-7">
          Waumini wameungana kuwa mwili mmoja katika Kristo, kila mmoja na
          karama tofauti, wote wanahitajika na kuthaminiwa, wakifanya kazi pamoja
          kwa faida ya kanisa lote.{" "}
          (<V>1 Wakorintho 12:12</V>, <V>Warumi 12:5</V>)
        </p>
        <H color="text-violet-300 decoration-violet-400">Kubebeana Mizigo</H>
        <p className="text-slate-200 leading-7">
          Tumeitwa kukutana pamoja mara kwa mara, kutiana moyo, na kubebeana
          mizigo kwa upendo.{" "}
          (<V>Waebrania 10:24-25</V>, <V>Wagalatia 6:2</V>)
        </p>
      </>
    ),
  },

  salvation: {
    en: (
      <>
        <H color="text-orange-300 decoration-orange-400">Saved by Grace Through Faith</H>
        <p className="text-slate-200 mb-5 leading-7">
          Salvation is a free gift from God, not something we can earn by our own
          efforts. It comes through faith in Jesus Christ alone.{" "}
          (<V>Ephesians 2:8-9</V>, <V>Romans 6:23</V>)
        </p>
        <H color="text-orange-300 decoration-orange-400">A New Creation</H>
        <p className="text-slate-200 leading-7">
          Anyone who trusts in Christ becomes a new creation — the old life is
          gone, and a new life begins, full of hope and purpose.{" "}
          (<V>2 Corinthians 5:17</V>, <V>Romans 10:9</V>)
        </p>
      </>
    ),
    fr: (
      <>
        <H color="text-orange-300 decoration-orange-400">Sauvés par Grâce, par le Moyen de la Foi</H>
        <p className="text-slate-200 mb-5 leading-7">
          Le salut est un don gratuit de Dieu, et non le fruit de nos propres
          efforts. Il vient uniquement par la foi en Jésus-Christ.{" "}
          (<V>Éphésiens 2:8-9</V>, <V>Romains 6:23</V>)
        </p>
        <H color="text-orange-300 decoration-orange-400">Une Nouvelle Création</H>
        <p className="text-slate-200 leading-7">
          Quiconque met sa confiance en Christ devient une nouvelle création —
          l'ancienne vie s'en est allée, et une vie nouvelle commence, pleine
          d'espérance et de sens.{" "}
          (<V>2 Corinthiens 5:17</V>, <V>Romains 10:9</V>)
        </p>
      </>
    ),
    sw: (
      <>
        <H color="text-orange-300 decoration-orange-400">Kuokolewa kwa Neema kwa Njia ya Imani</H>
        <p className="text-slate-200 mb-5 leading-7">
          Wokovu ni zawadi ya bure kutoka kwa Mungu, si kitu tunachoweza kujipatia
          kwa juhudi zetu wenyewe. Unakuja kwa njia ya imani katika Yesu Kristo
          pekee.{" "}
          (<V>Waefeso 2:8-9</V>, <V>Warumi 6:23</V>)
        </p>
        <H color="text-orange-300 decoration-orange-400">Kiumbe Kipya</H>
        <p className="text-slate-200 leading-7">
          Yeyote anayemwamini Kristo huwa kiumbe kipya — maisha ya zamani
          yamepita, na maisha mapya huanza, yaliyojaa tumaini na kusudi.{" "}
          (<V>2 Wakorintho 5:17</V>, <V>Warumi 10:9</V>)
        </p>
      </>
    ),
  },

  mission: {
    en: (
      <>
        <H color="text-teal-300 decoration-teal-400">Go and Make Disciples</H>
        <p className="text-slate-200 mb-5 leading-7">
          Jesus commissioned His followers to go into all the world, sharing the
          good news and making disciples of every nation.{" "}
          (<V>Matthew 28:19-20</V>, <V>Mark 16:15</V>)
        </p>
        <H color="text-teal-300 decoration-teal-400">Salt and Light</H>
        <p className="text-slate-200 leading-7">
          As a church, we are called to be salt and light in our community —
          living out God's love visibly so that others may see our good works
          and glorify our Father in heaven.{" "}
          (<V>Matthew 5:14</V>, <V>Philippians 2:15</V>)
        </p>
      </>
    ),
    fr: (
      <>
        <H color="text-teal-300 decoration-teal-400">Allez, Faites de Toutes les Nations des Disciples</H>
        <p className="text-slate-200 mb-5 leading-7">
          Jésus a chargé Ses disciples d'aller par tout le monde, de partager la
          bonne nouvelle et de faire des disciples de toutes les nations.{" "}
          (<V>Matthieu 28:19-20</V>, <V>Marc 16:15</V>)
        </p>
        <H color="text-teal-300 decoration-teal-400">Sel et Lumière</H>
        <p className="text-slate-200 leading-7">
          En tant qu'Église, nous sommes appelés à être le sel et la lumière dans
          notre communauté — vivant l'amour de Dieu de manière visible afin que
          d'autres voient nos bonnes œuvres et glorifient notre Père céleste.{" "}
          (<V>Matthieu 5:14</V>, <V>Philippiens 2:15</V>)
        </p>
      </>
    ),
    sw: (
      <>
        <H color="text-teal-300 decoration-teal-400">Nendeni Mkafanye Wanafunzi</H>
        <p className="text-slate-200 mb-5 leading-7">
          Yesu aliwatuma wafuasi Wake kwenda ulimwenguni kote, kushiriki habari
          njema na kufanya wanafunzi wa mataifa yote.{" "}
          (<V>Mathayo 28:19-20</V>, <V>Marko 16:15</V>)
        </p>
        <H color="text-teal-300 decoration-teal-400">Chumvi na Nuru</H>
        <p className="text-slate-200 leading-7">
          Kama kanisa, tumeitwa kuwa chumvi na nuru katika jamii yetu —
          tukiishi upendo wa Mungu kwa dhahiri ili wengine waone matendo yetu
          mema na kumtukuza Baba yetu wa mbinguni.{" "}
          (<V>Mathayo 5:14</V>, <V>Wafilipi 2:15</V>)
        </p>
      </>
    ),
  },
};
