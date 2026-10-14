export const SAMPLE_TRACKS = [
  {
    id: '0VjIjW4GlUZAMYd2vXMi3b',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
  },
  {
    id: '3AJwUDP919kvQ9QcozQPxg',
    title: 'Yellow',
    artist: 'Coldplay',
    album: 'Parachutes',
  },
  {
    id: '2Fxmhks0bxGSBdJ92vM42m',
    title: 'bad guy',
    artist: 'Billie Eilish',
    album: 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?',
  },
  {
    id: '4uLU6hMCjMI75M1A2tKUQC',
    title: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    album: 'Whenever You Need Somebody',
  },
  {
    id: '0e7ipj03S05BNilyu5bRzt',
    title: 'Sunflower',
    artist: 'Post Malone, Swae Lee',
    album: 'Spider-Man: Into the Spider-Verse',
  },
]

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
