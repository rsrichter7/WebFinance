// ─── LandingPage ───
// Publieke marketingpagina: de conversiegerichte landingspagina van Webfinance.

import React, { useEffect } from 'react'
import { T } from '../tokens'
import LandingNav from '../components/landing/LandingNav'
import LandingHero from '../components/landing/LandingHero'
import LandingPainSection from '../components/landing/LandingPainSection'
import LandingQuestionSection from '../components/landing/LandingQuestionSection'
import LandingUSP from '../components/landing/LandingUSP'
import LandingPricing from '../components/landing/LandingPricing'
import LandingCTA from '../components/landing/LandingCTA'
import LandingFooter from '../components/landing/LandingFooter'
import DonutMockup from '../components/landing/mockups/DonutMockup'
import StackedBarMockup from '../components/landing/mockups/StackedBarMockup'
import ProgressMockup from '../components/landing/mockups/ProgressMockup'
import UpcomingMockup from '../components/landing/mockups/UpcomingMockup'

const VRAGEN = [
  {
    vraag: 'Waar is mijn geld eigenlijk gebleven?',
    uitleg: 'In één oogopslag zie je dat boodschappen je grootste post is, niet je avondjes uit.',
    kant: 'left',
    bg: T.card,
    Mockup: DonutMockup,
  },
  {
    vraag: 'Wie betaalt wat in huis?',
    uitleg: "Splits de vaste lasten eerlijk met je partner of huisgenoot. Iedereen ziet precies wat-ie bijdraagt. Geen gedoe meer.",
    kant: 'right',
    bg: T.bg,
    Mockup: StackedBarMockup,
  },
  {
    vraag: 'Haal ik mijn spaardoel?',
    uitleg: 'Zet een doel, en zie of je op schema ligt voor die vakantie.',
    kant: 'left',
    bg: T.card,
    Mockup: ProgressMockup,
  },
  {
    vraag: 'Wat wordt er nog afgeschreven deze maand?',
    uitleg: 'Geen verrassingen meer aan het eind van de maand.',
    kant: 'right',
    bg: T.bg,
    Mockup: UpcomingMockup,
  },
]

export default function LandingPage() {
  // Scroll-reveal via IntersectionObserver voor alle .wf-reveal elementen
  useEffect(() => {
    const els = document.querySelectorAll('.wf-reveal')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          observer.unobserve(e.target)
        }
      }),
      { threshold: 0.07 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden' }}>
      <LandingNav />
      <LandingHero />
      <LandingPainSection />
      <div id="functies">
        {VRAGEN.map(v => (
          <LandingQuestionSection key={v.vraag} vraag={v.vraag} uitleg={v.uitleg} kant={v.kant} bg={v.bg}>
            <v.Mockup />
          </LandingQuestionSection>
        ))}
      </div>
      <LandingUSP />
      <LandingPricing />
      <LandingCTA />
      <LandingFooter />
    </div>
  )
}
