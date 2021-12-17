import React, { useEffect, useState } from "react";
import axios from "axios";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
import "@stream-io/stream-chat-css/dist/css/index.css";

const client = StreamChat.getInstance("juxxvgh645jf");

// const channel = client.channel("messaging", {
//   members: ["partycle"],
// });

const App = () => {
  const [clientReady, setClientReady] = useState(false);
  const [queryChannels, setQueryChannels] = useState(null);
  const filters = { members: { $in: ["partycle"] } };
  const sort = { last_message_at: -1 };
  const options = { limit: 10 };

  useEffect(() => {
    axios.get("http://localhost:4000/").then(async (resp) => {
      await client.connectUser(
        {
          id: "partycle",
          name: "partycle app",
        },
        resp.data
      );

      setClientReady(true);
    });
  }, []);

  useEffect(() => {
    if (clientReady) {
      axios.get("http://localhost:4000/channel").then(async (resp) => {
        const channels = await client.queryChannels(filters, sort, options);
        setQueryChannels(channels);
      });
    }
  }, [clientReady]);

  if (!clientReady) return null;

  return (
    <Chat client={client}>
      <ChannelList filters={filters} sort={sort} options={options} />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};

export default App;
