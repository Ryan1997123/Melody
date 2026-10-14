export const DISCOVER_MOODS = ['Rainy day', 'Gym', 'Road trip', 'Focus', 'Throwbacks']

export const FIGMA_CHARTS = [
  { id: '2qSkIjg1o9h3YT9RAgYN75', title: 'Espresso', artist: 'Sabrina Carpenter', album: 'Short n’ Sweet', moods: ['Gym', 'Road trip'] },
  { id: '0WbMK4wrZ1wFSty9F7FCgu', title: 'Good Luck, Babe!', artist: 'Chappell Roan', album: 'Good Luck, Babe!', moods: ['Rainy day', 'Focus'] },
  { id: '6dOtVTDdiauQNBQEDOtlAB', title: 'Birds of a Feather', artist: 'Billie Eilish', album: 'HIT ME HARD AND SOFT', moods: ['Rainy day', 'Focus'] },
  { id: '5vNRhkKd0yEAg8suGBpjeY', title: 'APT.', artist: 'ROSÉ & Bruno Mars', album: 'rosie', moods: ['Gym', 'Road trip'] },
  { id: '2plbrEY59IikOBgBGLjaoe', title: 'Die With A Smile', artist: 'Lady Gaga & Bruno Mars', album: 'Die With A Smile', moods: ['Rainy day', 'Focus', 'Throwbacks'] },
]
export const FIGMA_SONG = { id: '2MvvoeRt8NcOXWESkxWn3g', title: 'Ribs', artist: 'Lorde', album: 'Pure Heroine', moods: ['Rainy day', 'Focus'] }
export const FIGMA_CHAT = { id: '7eqoqGkKwgOaWNNHx90uEZ', title: 'Nights', artist: 'Frank Ocean', album: 'Blonde', moods: ['Rainy day', 'Focus'] }
export const FIGMA_TRENDING = [
  { id: '1k2pQc5i348DCHwbn5KTdc', title: 'Pink Pony Club', artist: 'Chappell Roan', album: 'The Rise and Fall of a Midwest Princess', moods: ['Road trip'] },
  { id: '6AI3ezQ4o3HUoP6Dhudph3', title: 'Not Like Us', artist: 'Kendrick Lamar', album: 'Not Like Us', moods: ['Gym'] },
  { id: '49UDOG8DoBajXTJSTqfRMg', title: 'Kyoto', artist: 'Phoebe Bridgers', album: 'Punisher', moods: ['Road trip'] },
  { id: '6GyFP1nfCDB8lbD2bG0Hq9', title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We’re Dreaming', moods: ['Road trip', 'Gym'] },
  { id: '0ofHAoxe9vBkTCp2UQIavz', title: 'Dreams', artist: 'Fleetwood Mac', album: 'Rumours', moods: ['Throwbacks', 'Focus'] },
  { id: '2P5yIMu2DNeMXTyOANKS6k', title: 'Nobody', artist: 'Mitski', album: 'Be the Cowboy', moods: ['Rainy day'] },
]

export const SAMPLE_TRACKS = [
  ...FIGMA_CHARTS, FIGMA_SONG, FIGMA_CHAT, ...FIGMA_TRENDING,
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
