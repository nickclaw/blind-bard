import * as Bluebird from 'bluebird';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import { Author } from '../entity/author';
import { Book } from '../entity/book';
import { Genre } from '../entity/genre';


async function createBook(data: any): Promise<any> {
  const authors = await Bluebird.map(data.authors, async (obj: any) => {
    const author = await Author.query().findOne('identifier', '=', obj.id);

    return {
      id: author ? author.id : undefined,
      identifier: parseInt(obj.id, 10),
      first_name: obj.first_name,
      last_name: obj.last_name,
    };
  });

  const genres = await Bluebird.map(data.genres, async (obj: any) => {
    const genre = await Genre.query().findOne('identifier', '=', obj.id);

    return {
      id: genre ? genre.id : undefined,
      identifier: parseInt(obj.id, 10),
      name: obj.name,
    };
  });

  const graph = {
    identifier: parseInt(data.id, 10),
    title: data.title,
    description: data.description,
    language: data.language,
    duration: parseInt(data.totaltimesecs, 10),
    authors: authors,
    genres: genres,
  };

  await Book.query<object>().upsertGraph(graph, {
    relate: true,
    unrelate: true,
    insertMissing: true
  });
}

export default async function init() {
  const dataPath = path.join(__dirname, '../../data');
  const files = fs.readdirSync(dataPath);

  await Bluebird.each(files, async (name, i) => {
    if (i % 100 === 0) console.log(i);
    const filePath = path.join(dataPath, name);
    const data = JSON.parse(fs.readFileSync(filePath).toString('utf8'));
    return await createBook(data);
  });
}
