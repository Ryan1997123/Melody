import { createAvatar } from '@dicebear/core'
import * as lorelei from '@dicebear/lorelei'

const optionalFeatures = ['glasses', 'earrings', 'beard', 'freckles', 'hairAccessories']
const features = ['hair', 'head', 'eyes', 'eyebrows', 'mouth', ...optionalFeatures]
export const AVO = Object.fromEntries(features.map(feature => {
  const variants = [...lorelei.schema.properties[feature].items.enum].sort()
  return [feature, optionalFeatures.includes(feature) ? ['none', ...variants] : variants]
}))

export const AV_COLORS = {
  hairColor: ['#2c1b18', '#6b4030', '#b58143', '#e8c77a', '#b5b5b5', '#111111', '#d9688a', '#477b72'],
  skinColor: ['#f8d5c2', '#edb98a', '#d08b5b', '#ae5d29', '#8d5524', '#613b24', '#f2e2d5', '#c68642'],
  bg: ['#ffffff', '#e0e0e0', '#b6e3f4', '#c0e8d5', '#ffd5dc', '#ffdfbf', '#d1d4f9', '#f6edb5'],
}

export const AV_TABS = [
  { id: 'hair', label: 'Hair', rows: [['Hair', 'hair'], ['Flowers', 'hairAccessories']], colors: [['Hair color', 'hairColor']] },
  { id: 'face', label: 'Face', rows: [['Head', 'head'], ['Eyes', 'eyes'], ['Brows', 'eyebrows'], ['Mouth', 'mouth']], colors: [] },
  { id: 'extras', label: 'Extras', rows: [['Glasses', 'glasses'], ['Earrings', 'earrings'], ['Beard', 'beard'], ['Freckles', 'freckles']], colors: [] },
  { id: 'colors', label: 'Colors', rows: [], colors: [['Skin tone', 'skinColor'], ['Background', 'bg']] },
]

export function initialAvatar(seed = 'sleeve-you') {
  return {
    seed, tab: 'hair', ...Object.fromEntries(features.map(feature => [feature, 0])),
    hairColor: 0, skinColor: 0, bg: 2,
  }
}

export function avatarLabel(feature, index) {
  const variant = AVO[feature][index]
  return variant === 'none' ? 'None' : `${index + 1 - Number(optionalFeatures.includes(feature))} / ${AVO[feature].length - Number(optionalFeatures.includes(feature))}`
}

export function avatarSVG(avatar) {
  const options = {
    seed: avatar.seed,
    backgroundColor: [AV_COLORS.bg[avatar.bg].slice(1)],
    hairColor: [AV_COLORS.hairColor[avatar.hairColor].slice(1)],
    skinColor: [AV_COLORS.skinColor[avatar.skinColor].slice(1)],
  }
  for (const feature of features) {
    const variant = AVO[feature][avatar[feature]]
    if (optionalFeatures.includes(feature)) options[`${feature}Probability`] = variant === 'none' ? 0 : 100
    if (variant !== 'none') options[feature] = [variant]
  }
  return createAvatar(lorelei, options).toString()
}

export function personAvatarSVG(seed) {
  return createAvatar(lorelei, {
    seed, backgroundColor: AV_COLORS.bg.map(color => color.slice(1)),
    hairColor: AV_COLORS.hairColor.map(color => color.slice(1)),
    skinColor: AV_COLORS.skinColor.map(color => color.slice(1)),
  }).toString()
}