const { dl_stream } = require('./dl_vod');
const { getStream, getVod } = require('./m3u8');
const { render_stream } = require('./render_stream');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const online_subscription = async (name, user_id, api_client) => {
  let online = false;
  while (true) {
    let date = new Date();
    console.log(
      `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] Checking status of stream: ${name}`
    );
    try {
      await getStream(name);
      const { data: videos } = await api_client.helix.videos.getVideosByUser(
        user_id,
        {
          limit: 1,
          type: 'archive',
        }
      );
      const channel_info = await api_client.helix.channels.getChannelInfo(
        user_id
      );
      const data = await getVod(videos[0].id);
      if (online === false) {
        online = true;
        let date = new Date();
        console.log(
          `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${name} is online`
        );
        await dl_stream(data[0].url, videos[0].id);
        await render_stream();
      }
    } catch (e) {
      if (online === true) {
        online = false;
        let date = new Date();
        console.log(
          `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${name} is offline`
        );
      }
    }
    await sleep(10000);
  }
};

module.exports = {
  online_subscription,
};
