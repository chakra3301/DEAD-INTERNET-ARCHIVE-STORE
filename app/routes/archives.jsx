import {Link} from 'react-router';
import {GlitchText} from '~/components/GlitchText';
import {GhostButton} from '~/components/GhostButton';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'Archives | Dead Internet Archive'},
    {description: 'Transmissions from the void. Documentation of digital entropy.'},
  ];
};

export default function ArchivesPage() {
  return (
    <div className="archives-page">
      <header className="archives-header">
        <GlitchText text="The Archives" as="h1" variant="glitch" />
        <p>
          Recovered transmissions from the spaces between. Each entry a fragment
          of signal, preserved before it fades to static.
        </p>
      </header>

      <div className="archives-content">
        {archiveEntries.map((entry, index) => (
          <ArchiveEntry key={entry.id} entry={entry} index={index + 1} />
        ))}
      </div>
    </div>
  );
}

/**
 * @param {{entry: ArchiveEntryType, index: number}}
 */
function ArchiveEntry({entry, index}) {
  const formattedIndex = String(index).padStart(3, '0');

  return (
    <article className="archive-entry">
      <div className="archive-entry-index">{formattedIndex}</div>
      <div className="archive-entry-content">
        <h2>{entry.title}</h2>
        <p>{entry.excerpt}</p>
        <div className="archive-entry-meta">
          <span>{entry.date}</span>
          <span>{entry.category}</span>
          <span className="coordinates">{entry.coordinates}</span>
        </div>
        {entry.image && (
          <div className="archive-entry-image">
            <img src={entry.image} alt={entry.title} />
          </div>
        )}
      </div>
    </article>
  );
}

// Sample archive entries - in production these would come from a CMS or Shopify metaobjects
const archiveEntries = [
  {
    id: '001',
    title: 'Signal Decay: The First Transmission',
    excerpt: `In the beginning, there was signal. Pure, unfiltered data streaming through copper and light.
    We documented the first signs of decay—when packets began to arrive corrupted, when images loaded
    in fragments, when the internet started to forget itself. This is the chronicle of that forgetting.`,
    date: '2024.01.15',
    category: 'Transmission',
    coordinates: '40.7128°N, 74.0060°W',
    image: null,
  },
  {
    id: '002',
    title: 'Ghost Protocol: Digital Footprints',
    excerpt: `Every interaction leaves a trace. But what happens when those traces begin to fade?
    We explored the abandoned servers, the dead links, the 404 graveyards where websites go to die.
    Ghost Protocol is our attempt to capture what remains before it dissolves into the static.`,
    date: '2024.02.03',
    category: 'Documentation',
    coordinates: '51.5074°N, 0.1278°W',
    image: null,
  },
  {
    id: '003',
    title: 'Void Manifest: Cataloging Absence',
    excerpt: `The void is not empty—it is full of everything that has been erased. Deleted posts,
    scrubbed accounts, purged databases. We began cataloging these absences, creating a negative
    image of the internet's memory. The Void Manifest grows larger every day.`,
    date: '2024.03.21',
    category: 'Archive',
    coordinates: '35.6762°N, 139.6503°E',
    image: null,
  },
  {
    id: '004',
    title: 'Static Dreams: Sleep Mode Transmissions',
    excerpt: `Between midnight and 4 AM, when human traffic reaches its lowest ebb, something strange
    happens to the network. We monitored these hours, recording the automated conversations between
    machines, the scheduled tasks running in empty offices, the bots talking to bots in languages
    they invented themselves.`,
    date: '2024.04.08',
    category: 'Research',
    coordinates: '37.7749°N, 122.4194°W',
    image: null,
  },
  {
    id: '005',
    title: 'Entropy Garden: Where Data Goes to Die',
    excerpt: `We discovered it by accident—a server farm in Nevada, long abandoned, still running on
    solar power. Inside, petabytes of data slowly corrupting, bit by bit. We called it the Entropy
    Garden, and we've been tending to it ever since, documenting its beautiful decay.`,
    date: '2024.05.17',
    category: 'Expedition',
    coordinates: '36.1699°N, 115.1398°W',
    image: null,
  },
  {
    id: '006',
    title: 'The Last Webpage: A Eulogy',
    excerpt: `Somewhere out there, a webpage loads for the last time. No fanfare, no ceremony—just
    one final HTTP request before the domain expires and the hosting runs out. We've been collecting
    these final moments, preserving the last breath of digital life before it blinks out forever.`,
    date: '2024.06.29',
    category: 'Memorial',
    coordinates: '52.5200°N, 13.4050°E',
    image: null,
  },
];

/** @typedef {import('./+types/archives').Route} Route */
/** @typedef {{id: string, title: string, excerpt: string, date: string, category: string, coordinates: string, image: string | null}} ArchiveEntryType */
