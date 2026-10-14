export const DISCOVER_MOODS = ['Rainy day', 'Gym', 'Road trip', 'Focus', 'Throwbacks']

export const SAMPLE_TRACKS = [
  {
    id: '0VjIjW4GlUZAMYd2vXMi3b',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    moods: ['Gym', 'Road trip'],
  },
  {
    id: '3AJwUDP919kvQ9QcozQPxg',
    title: 'Yellow',
    artist: 'Coldplay',
    album: 'Parachutes',
    moods: ['Rainy day', 'Focus', 'Throwbacks'],
  },
  {
    id: '2Fxmhks0bxGSBdJ92vM42m',
    title: 'bad guy',
    artist: 'Billie Eilish',
    album: 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?',
    moods: ['Gym'],
  },
  {
    id: '4uLU6hMCjMI75M1A2tKUQC',
    title: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    album: 'Whenever You Need Somebody',
    moods: ['Throwbacks', 'Road trip'],
  },
  {
    id: '0e7ipj03S05BNilyu5bRzt',
    title: 'Sunflower',
    artist: 'Post Malone, Swae Lee',
    album: 'Spider-Man: Into the Spider-Verse',
    moods: ['Road trip', 'Focus'],
  },
]

export function filterDiscoverTracks(tracks, query, moods) {
  const normalized = query.trim().toLowerCase()
  return tracks.filter(track => {
    const tags = track.moods || SAMPLE_TRACKS.find(sample => sample.id === track.id)?.moods || []
    const matchesMood = !moods.size || tags.some(mood => moods.has(mood))
    const matchesQuery = !normalized || `${track.title} ${track.artist} ${track.album}`.toLowerCase().includes(normalized)
    return matchesMood && matchesQuery
  })
}

export function spotifyTrack(track) {
  const album = track.album
  return {
    id: track.id,
    title: track.name,
    artist: track.artists.map(artist => artist.name).join(', '),
    album: album.name,
    image: album.images[0]?.url || '',
    url: track.external_urls.spotify,
  }
}
