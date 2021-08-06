const { dl_stream } = require('./dl_vod');
const { getStream, getVod } = require('./m3u8');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const online_subscription = async (name, user_id, listener, api_client) => {
  let online = false;
  while (true) {
    try {
      await getStream(name);
      const { data: videos } = await api_client.helix.videos.getVideosByUser(
        user_id,
        {
          limit: 1,
          type: 'archive',
        }
      );
      getVod(videos[0].id)
        .then((data) => {
          if (online === false) {
            online = true;
            let date = new Date();
            console.log(
              `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${name} is online`
            );
            console.log(data[0].url);
            await dl_stream(data[0].url);
          }
        })
        .catch((err) => console.error(err));
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