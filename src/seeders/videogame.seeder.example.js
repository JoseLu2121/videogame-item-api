import { Videogame } from '../models/videogame.model.js';

export class VideogameSeeder {
  constructor() {
    this.name = "IGDB Games Seeder";
  }

  async run() {
    console.log("   -> Obtaining access token...");

    const accessToken = await getTwitchAccessToken({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });

    console.log("   -> Twitch access token obtained.");

    const [videogames, gameTypes, languages] = await Promise.all([
      getIGDBGames({ clientId: process.env.CLIENT_ID, accessToken }),
      getIGBDGameTypes({ clientId: process.env.CLIENT_ID, accessToken }),
      getIGBDLanguages({ clientId: process.env.CLIENT_ID, accessToken }),
    ]);

    const gameTypeMap = new Map(gameTypes.map((gameType) => [gameType.id, gameType]));
    const languageMap = new Map(languages.map((language) => [language.id, language]));

    console.log(`   -> Fetched ${videogames.length} games from IGDB.`);

    console.log(videogames[8].language_supports)
    console.log(languageMap);

    const docs = videogames.map((videogame) => ({
      igdb_id: videogame.id,
      name: videogame.name,
      summary: videogame.summary,
      storyline: videogame.storyline,
      rating: videogame.rating,
      rating_count: videogame.rating_count,
      first_release_date: videogame.first_release_date
          ? new Date(videogame.first_release_date * 1000)
          : undefined,
      game_type: gameTypeMap.get(videogame.game_type)?.type ?? undefined,
      cover: videogame.cover ? `https:${videogame.cover.url}` : undefined,
      collections: (videogame.collections ?? []).map((collection) => collection.name),
      franchises: (videogame.franchises ?? []).map((franchise) => franchise.name),
      genres: (videogame.genres ?? []).map((genre) => genre.name),
      keywords: (videogame.keywords ?? []).map((keywords) => keywords.name),
      themes: (videogame.themes ?? []).map((themes) => themes.name),
      videos: (videogame.videos ?? []).map((video) => video.video_id),
      languages: [...new Set((videogame.language_supports ?? []).map((languageSupport) => languageMap.get(languageSupport.language)?.name))]
    }));

    await Videogame.insertMany(docs)

    console.log(`   -> ${docs.length} games saved to database.`);
  }
}

async function getIGDBGames({ clientId, accessToken }) {
  const body = `
    fields
      cover.*,
      collections.*,
      first_release_date,
      franchises.*,
      game_type,
      genres.*,
      keywords.*,
      name,
      rating,
      rating_count,
      storyline,
      summary,
      videos.*,
      language_supports.*,
      themes.*;
    limit 500;
  `;

  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "text/plain",
    },
    body,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`IGDB error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  return response.json();
}

async function getIGBDGameTypes({ clientId, accessToken }) {
  const response = await fetch("https://api.igdb.com/v4/game_types", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "text/plain",
    }
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`IGDB error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  return response.json();
}

async function getIGBDLanguages({ clientId, accessToken }) {
  const response = await fetch("https://api.igdb.com/v4/languages", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "text/plain",
    },
    body: "fields name; limit 28;"
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`IGDB error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  return response.json();
}


async function getTwitchAccessToken({ clientId, clientSecret }) {
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  });

  const response = await fetch(`https://id.twitch.tv/oauth2/token?${params.toString()}`, {
    method: "POST",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Error requesting Twitch token: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const data = await response.json();

  if (!data?.access_token) {
    throw new Error("Twitch token response did not include access_token");
  }

  return data.access_token;
}