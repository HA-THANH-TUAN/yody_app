import slugify from 'slugify';

function genSlug(data: string) {
  return slugify(data, { lower: true, locale: 'vi' });
}

export { genSlug };
