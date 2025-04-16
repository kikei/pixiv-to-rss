import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda';

import { getEnvironment } from './Environment';
import { loadParameter } from './ParameterLoader';

import PixivApi = require('pixiv-api-client');
import { Illust } from './@types/pixiv-api-client-types';

const env = getEnvironment(process.env);

export const handler = async (
  _event: APIGatewayProxyEventV2WithRequestContext<{}>
) => {
  try {
    const rss = await main();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/rss+xml'
      },
      body: rss
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: 'Internal Server Error'
    };
  }
};

async function main() {
  const parameter = await loadParameter({
    parameterStoreId: env.get('PIXIV2RSS_PARAMETER_STORE_ID')
  });
  const pixiv = new PixivApi();
  const result = await pixiv.refreshAccessToken(parameter.pixiv.refreshToken);
  console.debug('result:', JSON.stringify(result, null, 2));
  const response = await pixiv.illustFollow({restrict: 'all'});
  const rss = buildRss2({
    title: 'Pixiv Follow',
    link: 'https://www.pixiv.net/',
    description: 'Pixiv Follow',
    illusts: response.illusts
  });
  console.log(rss);
  return rss;
}

function buildRss2({
  title,
  link,
  description,
  illusts
}: {
  title: string,
  link: string,
  description: string,
  illusts: Illust[]
}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${title}</title>
    <link>${link}</link>
    <description>${description}</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    ${illusts.map(toRssItem).join('\n')}
  </channel>
</rss>`;
}

function toRssItem(illust: Illust) {
  return `<item>
      <title>${illust.title}</title>
      <link>https://www.pixiv.net/artworks/${illust.id}</link>
      <author><![CDATA[${illust.user.name}]]></author>
      <description>
        <![CDATA[
${illust.caption}
${illust.tags.map(tag => `#${tag.name}`).join(' ')}
          <img src="${illust.image_urls.large}" />
        ]]>
      </description>
      <pubDate>${new Date(illust.create_date).toUTCString()}</pubDate>
    </item>
`;
}
