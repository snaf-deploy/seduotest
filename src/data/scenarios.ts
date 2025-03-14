import { Scenario } from '../types/practice';

export const scenarios: Scenario[] = [
  {
    id: '1',
    title: 'Zaměstnanec chce zvýšit mzdu',
    situation: 'Pravidelný 1:1 meeting s podřízeným',
    context: 'Přijdete na pravidelný 1:1 meeting s vaším podřízeným. On vypadá nějaký napjatý a lehce nervózní. Jako jeho manažer víte, že jeho práce je kvalitní, ale v poslední době se objevily určité problémy s dodržování termínů.',
    currentStepIndex: 0,
    steps: [
      {
        id: 'step1',
        messages: [
          {
            id: 'msg1',
            speaker: 'user',
            text: 'Jak se máte tento týden?',
            emotion: 'neutral'
          },
          {
            id: 'msg2',
            speaker: 'other',
            text: 'Upřímně, chtěl bych s vámi mluvit o mém ohodnocení. Pracuji zde už dva roky a myslím, že si zasloužím navýšení.',
            emotion: 'determined'
          }
        ],
        prompt: 'Jak začnete diskusi o platu?',
        choices: [
          {
            id: '1a',
            text: 'Pojďme si nejdřív projít vaše výsledky a přínosy za poslední období.',
            isCorrect: true,
            feedback: 'Výborně! Chcete diskutovat na základě konkrétních dat a přínosů.'
          },
          {
            id: '1b',
            text: 'Teď není vhodná doba na zvyšování platů.',
            isCorrect: false,
            feedback: 'Okamžité odmítnutí bez diskuse může vést k demotivaci a případnému odchodu zaměstnance.'
          },
          {
            id: '1c',
            text: 'O kolik byste chtěl přidat?',
            isCorrect: false,
            feedback: 'Příliš přímá otázka bez kontextu. Je lepší nejprve pochopit důvody a projednat výkon.'
          }
        ]
      },
      {
        id: 'step2',
        messages: [
          {
            id: 'msg3',
            speaker: 'other',
            text: 'Za poslední rok jsem dokončil tři klíčové projekty a zaučil dva nové kolegy. Ale poslední dobou mám problém stíhat termíny, protože mám příliš mnoho úkolů a zodpovědností.',
            emotion: 'frustrated'
          }
        ],
        prompt: 'Jak budete reagovat na tuto situaci?',
        choices: [
          {
            id: '2a',
            text: 'Ty problémy s termíny jsou překážkou pro navýšení platu.',
            isCorrect: false,
            feedback: 'Negativní přístup ignoruje pozitivní přínosy a může vést k demotivaci.'
          },
          {
            id: '2b',
            text: 'Oceňuji vaše úspěchy. Pojďme probrat, jak můžeme lépe rozložit vaši pracovní zátěž a nastavit realistické cíle pro další období.',
            isCorrect: true,
            feedback: 'Správně! Uznáváte přínosy a současně řešíte aktuální problémy konstruktivně.'
          },
          {
            id: '2c',
            text: 'Musíte se naučit lépe organizovat svůj čas.',
            isCorrect: false,
            feedback: 'Přehazujete odpovědnost pouze na zaměstnance bez nabídky podpory.'
          }
        ]
      },
      {
        id: 'step3',
        messages: [
          {
            id: 'msg4',
            speaker: 'other',
            text: 'Děkuji za pochopení. Myslím, že si zasloužím navýšení o 20%. Je to v souladu s trhem a mými zkušenostmi.',
            emotion: 'determined'
          }
        ],
        prompt: 'Jak budete diskutovat o konkrétní částce?',
        choices: [
          {
            id: '3a',
            text: 'To je příliš vysoké navýšení. Maximálně můžeme uvažovat o 5%.',
            isCorrect: false,
            feedback: 'Okamžité odmítnutí bez diskuse a vysvětlení není konstruktivní.'
          },
          {
            id: '3b',
            text: 'Pojďme si projít naše interní platové rozpětí a vaši pozici v něm. Také bych rád viděl data o trhu, která zmiňujete.',
            isCorrect: true,
            feedback: 'Výborně! Vedete diskusi na základě dat a transparentně.'
          },
          {
            id: '3c',
            text: 'Dobře, ale nejdřív musíte zlepšit dodržování termínů.',
            isCorrect: false,
            feedback: 'Podmínky by měly být stanoveny dopředu, ne použity jako odmítnutí.'
          }
        ]
      },
      {
        id: 'step4',
        messages: [
          {
            id: 'msg5',
            speaker: 'other',
            text: 'Rozumím. Mám připravený přehled svých úspěchů a také průzkum platů v oboru. Kdy můžeme očekávat konkrétní rozhodnutí?',
            emotion: 'neutral'
          }
        ],
        prompt: 'Jak nastavíte další kroky?',
        choices: [
          {
            id: '4a',
            text: 'Navrhuju dvoustupňové navýšení: 10% nyní za dosavadní výsledky a možnost dalších 10% za 6 měsíců při splnění dohodnutých cílů.',
            isCorrect: true,
            feedback: 'Výborně! Nabízíte konkrétní plán s jasnou perspektivou růstu.'
          },
          {
            id: '4b',
            text: 'Musím to probrat s vedením, ozveme se vám.',
            isCorrect: false,
            feedback: 'Příliš vágní odpověď bez konkrétního závazku.'
          },
          {
            id: '4c',
            text: 'Uvidíme podle výsledků na konci roku.',
            isCorrect: false,
            feedback: 'Odkládáte rozhodnutí bez jasného plánu a kritérií.'
          }
        ]
      },
      {
        id: 'step5',
        messages: [
          {
            id: 'msg6',
            speaker: 'other',
            text: 'To zní zajímavě. Jaké konkrétní cíle bychom měli splnit pro to druhé navýšení?',
            emotion: 'hopeful'
          }
        ],
        prompt: 'Jak nastavíte cíle pro další navýšení?',
        choices: [
          {
            id: '5a',
            text: 'Stanovíme 3-4 klíčové metriky: dodržování termínů, kvalita kódu, mentoring juniorů a vedení jednoho strategického projektu. Připravím detailní plán do konce týdne.',
            isCorrect: true,
            feedback: 'Výborně! Definujete jasné, měřitelné cíle s konkrétním časovým rámcem.'
          },
          {
            id: '5b',
            text: 'Hlavně musíte zlepšit svůj výkon.',
            isCorrect: false,
            feedback: 'Příliš vágní a negativně formulované cíle.'
          },
          {
            id: '5c',
            text: 'To ještě uvidíme podle situace.',
            isCorrect: false,
            feedback: 'Nedostatek transparentnosti může vést k nejistotě a nedůvěře.'
          }
        ]
      },
      {
        id: 'step6',
        messages: [
          {
            id: 'msg7',
            speaker: 'other',
            text: 'Děkuji za konstruktivní přístup. Kdy přesně by mělo přijít první navýšení a jak to bude formálně probíhat?',
            emotion: 'hopeful'
          }
        ],
        prompt: 'Jak uzavřete diskusi?',
        choices: [
          {
            id: '6a',
            text: 'První navýšení bude v příští výplatě. Do konce týdne dostanete písemný dodatek ke smlouvě s detailním plánem včetně kritérií pro druhé navýšení. Ještě dnes zadám požadavek na HR.',
            isCorrect: true,
            feedback: 'Výborně! Dáváte jasný závazek s konkrétními kroky a časovým rámcem.'
          },
          {
            id: '6b',
            text: 'Připravíme papíry a dáme vám vědět.',
            isCorrect: false,
            feedback: 'Příliš neurčitá odpověď bez konkrétního závazku.'
          },
          {
            id: '6c',
            text: 'Až splníte všechny podmínky, které jsme zmínili.',
            isCorrect: false,
            feedback: 'Zaměňujete první navýšení s druhým a vytváříte nejistotu.'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Řešení výkonnostních problémů',
    situation: 'Zpětná vazba na výkon',
    context: 'Máte naplánovanou schůzku s Vaším podřízeným ohledně jeho výkonu. V posledních třech měsících jste zaznamenali pokles kvality jeho práce, častější chyby v kódu a několik zmeškaných termínů. Zároveň si všímáte, že chodí později do práce a působí méně soustředěně než dříve.',
    currentStepIndex: 0,
    steps: [
      {
        id: 'step1',
        messages: [
          {
            id: 'msg1',
            speaker: 'user',
            text: 'Dobrý den, děkuji že jste přišel. Jak se dnes máte?',
            emotion: 'neutral'
          },
          {
            id: 'msg2',
            speaker: 'other',
            text: 'Dobrý den... No, upřímně, už tuším, o čem to bude.',
            emotion: 'stressed'
          }
        ],
        prompt: 'Jak začnete tento obtížný rozhovor?',
        choices: [
          {
            id: '1a',
            text: 'Ano, musíme si promluvit o Vašem výkonu. V poslední době to není dobré.',
            isCorrect: false,
            feedback: 'Příliš přímý a konfrontační začátek může zaměstnance uzavřít.'
          },
          {
            id: '1b',
            text: 'Pojďme si nejdřív promluvit o tom, jak se v práci cítíte a co se u Vás děje.',
            isCorrect: true,
            feedback: 'Výborně! Začínáte empaticky a dáváte prostor zaměstnanci vyjádřit se.'
          },
          {
            id: '1c',
            text: 'Tak to máte pravdu, Vaše pozdní příchody a chyby v kódu jsou nepřijatelné.',
            isCorrect: false,
            feedback: 'Začínat kritikou není konstruktivní a může vést k defenzivní reakci.'
          }
        ]
      },
      {
        id: 'step2',
        messages: [
          {
            id: 'msg3',
            speaker: 'other',
            text: 'No... poslední dobou toho mám hodně. Doma řeším nějaké osobní problémy a asi se to projevuje i v práci. Vím, že dělám chyby...',
            emotion: 'stressed'
          }
        ],
        prompt: 'Jak budete reagovat na toto přiznání?',
        choices: [
          {
            id: '2a',
            text: 'Chápu, že máte osobní problémy, ale práce je práce. Musíte se víc snažit.',
            isCorrect: false,
            feedback: 'Tato odpověď ignoruje lidský aspekt situace a může prohloubit stres zaměstnance.'
          },
          {
            id: '2b',
            text: 'Děkuji za Vaši upřímnost. Můžete mi říct víc o tom, co Vás trápí a jak Vám můžeme pomoct?',
            isCorrect: true,
            feedback: 'Správně! Projevujete empatii a nabízíte podporu.'
          },
          {
            id: '2c',
            text: 'To je mi líto, ale potřebujeme najít řešení. Jaké máte návrhy na zlepšení?',
            isCorrect: false,
            feedback: 'Příliš rychle přecházíte k řešení, aniž byste dal prostor pro sdílení problému.'
          }
        ]
      },
      {
        id: 'step3',
        messages: [
          {
            id: 'msg4',
            speaker: 'other',
            text: 'Procházím rozvodem a je to hodně náročné. Někdy nemůžu spát a pak ráno nestíhám. Vím, že to není omluva, ale snažím se s tím nějak vypořádat.',
            emotion: 'frustrated'
          }
        ],
        description: 'Musíte vyvážit empatii s potřebou udržet pracovní standardy.',
        prompt: 'Jak zareagujete na tuto citlivou situaci?',
        choices: [
          {
            id: '3a',
            text: 'To mě mrzí, ale musíme najít způsob, jak to nebude ovlivňovat práci.',
            isCorrect: false,
            feedback: 'Příliš rychle přecházíte k pracovním záležitostem bez dostatečné empatie.'
          },
          {
            id: '3b',
            text: 'Je mi líto, čím procházíte. Pojďme společně najít způsob, jak Vám můžeme v této situaci pomoct, aby to bylo zvládnutelné jak pro Vás, tak pro tým.',
            isCorrect: true,
            feedback: 'Výborně! Vyvažujete empatii s praktickým přístupem k řešení situace.'
          },
          {
            id: '3c',
            text: 'To musí být těžké. Nechcete si vzít nějaké volno?',
            isCorrect: false,
            feedback: 'Nabízíte rychlé řešení bez hlubšího zamyšlení nad dlouhodobou udržitelností.'
          }
        ]
      },
      {
        id: 'step4',
        messages: [
          {
            id: 'msg5',
            speaker: 'other',
            text: 'Děkuji za pochopení. Máte pravdu, že to takhle nejde dál. Co navrhujete?',
            emotion: 'neutral'
          }
        ],
        prompt: 'Jak nastavíte plán podpory a zlepšení?',
        choices: [
          {
            id: '4a',
            text: 'Pojďme Vám nastavit flexibilnější pracovní dobu a dočasně přidělit méně náročné úkoly. Zároveň bych Vám rád připomněl, že máme k dispozici firemního psychologa.',
            isCorrect: true,
            feedback: 'Výborně! Nabízíte konkrétní podporu a připomínáte dostupné zdroje pomoci.'
          },
          {
            id: '4b',
            text: 'Musíte se hlavně soustředit na práci a osobní věci řešit ve svém volném čase.',
            isCorrect: false,
            feedback: 'Necitlivá odpověď, která ignoruje komplexnost situace.'
          },
          {
            id: '4c',
            text: 'Dejte si týden volna a pak se uvidí.',
            isCorrect: false,
            feedback: 'Krátkodobé řešení bez dlouhodobé strategie podpory.'
          }
        ]
      },
      {
        id: 'step5',
        messages: [
          {
            id: 'msg6',
            speaker: 'other',
            text: 'To by mi opravdu pomohlo. Jak budeme kontrolovat, že se situace zlepšuje?',
            emotion: 'hopeful'
          }
        ],
        prompt: 'Jak nastavíte sledování pokroku?',
        choices: [
          {
            id: '5a',
            text: 'Budeme se potkávat každý týden a procházet Vaše úkoly a případné problémy. Za měsíc vyhodnotíme, jak opatření fungují a co případně upravit.',
            isCorrect: true,
            feedback: 'Výborně! Nastavujete jasný systém podpory a kontroly s konkrétním časovým rámcem.'
          },
          {
            id: '5b',
            text: 'Uvidíme za měsíc, jestli se to zlepší.',
            isCorrect: false,
            feedback: 'Příliš vágní a bez průběžné podpory.'
          },
          {
            id: '5c',
            text: 'Budu kontrolovat všechnu Vaši práci každý den.',
            isCorrect: false,
            feedback: 'Příliš kontrolující přístup, který může vyvolat další stres.'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Řešení konfliktů',
    situation: 'Konflikt v týmu ohledně technického směru',
    context: 'Jste vedoucí týmu a dva Vaši seniorní vývojáři, Tomáš a Martin, mají vážný konflikt ohledně architektury nového projektu. Tomáš prosazuje mikroservisní architekturu, zatímco Martin argumentuje pro monolitické řešení. Jejich spor začíná ovlivňovat celý tým a brzdí pokrok na projektu.',
    currentStepIndex: 0,
    steps: [
      {
        id: 'step1',
        messages: [
          {
            id: 'msg1',
            speaker: 'user',
            text: 'Dobrý den, svolal jsem tuto schůzku, abychom si promluvili o současné situaci v týmu. Jak vnímáte současný stav?',
            emotion: 'neutral'
          },
          {
            id: 'msg2',
            speaker: 'other',
            text: 'Je to frustrující. Martin odmítá vidět výhody mikroservisní architektury a blokuje jakýkoliv pokrok. Takhle nemůžeme pokračovat.',
            emotion: 'frustrated'
          }
        ],
        prompt: 'Jak začnete řešit tento konflikt?',
        choices: [
          {
            id: '1a',
            text: 'Pojďme si nejdřív vyslechnout argumenty obou stran. Můžete mi detailně vysvětlit, proč je podle Vás mikroservisní architektura lepší volba?',
            isCorrect: true,
            feedback: 'Výborně! Dáváte prostor k vyjádření názoru a snažíte se pochopit technické argumenty.'
          },
          {
            id: '1b',
            text: 'Martin má pravdu, monolitická architektura je pro tento projekt vhodnější.',
            isCorrect: false,
            feedback: 'Přikláníte se k jedné straně bez vyslechnutí všech argumentů.'
          },
          {
            id: '1c',
            text: 'Musíte se nějak dohodnout, nemůžeme takhle ztrácet čas.',
            isCorrect: false,
            feedback: 'Tlačíte na rychlé řešení bez pochopení podstaty problému.'
          }
        ]
      },
      {
        id: 'step2',
        messages: [
          {
            id: 'msg3',
            speaker: 'other',
            text: 'Mikroservisy nám umožní lépe škálovat jednotlivé komponenty a rychleji nasazovat změny. Martin ale tvrdí, že to zbytečně komplikuje vývoj a údržbu.',
            emotion: 'determined'
          }
        ],
        prompt: 'Jak budete moderovat tuto technickou diskusi?',
        choices: [
          {
            id: '2a',
            text: 'Co kdybychom udělali proof of concept obou přístupů? Mohli byste každý připravit demo na malé části projektu.',
            isCorrect: true,
            feedback: 'Správně! Navrhujete praktické ověření obou přístupů, které pomůže objektivně posoudit výhody a nevýhody.'
          },
          {
            id: '2b',
            text: 'Máte pravdu, mikroservisy jsou modernější řešení.',
            isCorrect: false,
            feedback: 'Rozhodujete na základě trendů, ne skutečných potřeb projektu.'
          },
          {
            id: '2c',
            text: 'Prostě to uděláme tak, jak jsme zvyklí.',
            isCorrect: false,
            feedback: 'Vyhýbáte se řešení konfliktu a inovaci.'
          }
        ]
      },
      {
        id: 'step3',
        messages: [
          {
            id: 'msg4',
            speaker: 'other',
            text: 'To by mohlo fungovat, ale už teď máme skluz. Nemáme čas na experimenty.',
            emotion: 'stressed'
          }
        ],
        prompt: 'Jak vyřešíte časový tlak a potřebu správného rozhodnutí?',
        choices: [
          {
            id: '3a',
            text: 'Pojďme si stanovit jasná kritéria pro rozhodnutí a časový rámec pro proof of concept. Můžeme paralelně pokračovat na částech, které nejsou architekturou ovlivněné. Co říkáte?',
            isCorrect: true,
            feedback: 'Výborně! Nabízíte strukturovaný přístup a praktické řešení časového tlaku.'
          },
          {
            id: '3b',
            text: 'Tak to udělejte podle svého návrhu, ať se můžeme pohnout dál.',
            isCorrect: false,
            feedback: 'Vyhýbáte se zodpovědnosti za důležité architektonické rozhodnutí.'
          },
          {
            id: '3c',
            text: 'Máte pravdu, nemůžeme ztrácet čas. Pokračujme v monolitickém přístupu.',
            isCorrect: false,
            feedback: 'Děláte unáhlené rozhodnutí pod časovým tlakem.'
          }
        ]
      },
      {
        id: 'step4',
        messages: [
          {
            id: 'msg5',
            speaker: 'other',
            text: 'A co když se ani po proof of conceptu neshodneme? Už teď je atmosféra v týmu napjatá.',
            emotion: 'worried'
          }
        ],
        prompt: 'Jak zajistíte konstruktivní spolupráci?',
        choices: [
          {
            id: '4a',
            text: 'Navrhuji, abychom si předem stanovili objektivní kritéria pro hodnocení obou přístupů. Zároveň bych rád zapojil celý tým do diskuse, protože toto rozhodnutí ovlivní všechny. Souhlasíte?',
            isCorrect: true,
            feedback: 'Výborně! Vytváříte transparentní proces rozhodování a podporujete týmovou spolupráci.'
          },
          {
            id: '4b',
            text: 'Pokud se neshodnete, rozhodnu já jako vedoucí.',
            isCorrect: false,
            feedback: 'Autoritativní přístup může dále poškodit vztahy v týmu.'
          },
          {
            id: '4c',
            text: 'Třeba se ukáže, že můžeme zkombinovat oba přístupy.',
            isCorrect: false,
            feedback: 'Vyhýbáte se jasnému rozhodnutí a můžete vytvořit další problémy.'
          }
        ]
      },
      {
        id: 'step5',
        messages: [
          {
            id: 'msg6',
            speaker: 'other',
            text: 'To zní rozumně. Kdy a jak začneme s přípravou proof of conceptu?',
            emotion: 'hopeful'
          }
        ],
        prompt: 'Jak naplánujete další postup?',
        choices: [
          {
            id: '5a',
            text: 'Dnes odpoledne se sejdeme celý tým, stanovíme kritéria hodnocení a rozdělíme práci na proof of conceptech. Příští týden uděláme prezentaci výsledků a společně vybereme nejlepší řešení. Vyhovuje Vám tento plán?',
            isCorrect: true,
            feedback: 'Výborně! Máte konkrétní plán s jasnými kroky a zapojujete celý tým do rozhodování.'
          },
          {
            id: '5b',
            text: 'Připravte každý svůj návrh do konce týdne.',
            isCorrect: false,
            feedback: 'Nedostatečně strukturovaný přístup bez jasných kritérií a spolupráce.'
          },
          {
            id: '5c',
            text: 'Pošlu vám email s detaily.',
            isCorrect: false,
            feedback: 'Příliš pasivní přístup k důležitému rozhodnutí.'
          }
        ]
      }
    ]
  }
]; 