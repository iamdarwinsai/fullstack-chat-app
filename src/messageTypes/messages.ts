import { z } from "zod";

/*

    {
        type:"JOIN",
        payload:{
            roomId:"blahblah",
            token:JWT
        }
    }

    {
        type:"SEND_MESSAGE",
        payload:{
            message:"Why?"
            roomId:"blahblah"
        }
    }

    {
        type:"UpVote_message",
        payload:{
            messgaID:"asdasdasd",
            roomId:"blahblah"
        }
    }

    {
        type:DownVote_message,
        payload:{
            messageID:"asdasda",
        }
    }
*/
export enum SupportedMessages {
  JoinRoom = "JOIN_ROOM",
  SendMessage = "SEND_MESSAGE",
  UpvoteMessage = "UPVOTE_MESSAGE",
  DownVoteMessage = "DOWNVOTE_MESSAGE",
}

export type IncomingMessage =
  | {
      type: SupportedMessages.JoinRoom;
      payload: JoinMessageType;
    }
  | {
      type: SupportedMessages.SendMessage;
      payload: SendMessageType;
    }
  | {
      type: SupportedMessages.UpvoteMessage;
      payload: upVoteType;
    }
  | {
      type: SupportedMessages.DownVoteMessage;
      payload: downVoteType;
    };

const joinMessage = z.object({
  roomId: z.string(),
  userId: z.string(),
});

export type JoinMessageType = z.infer<typeof joinMessage>;

const sendMessage = z.object({
  userId: z.string(),
  message: z.string(),
  roomId: z.string(),
});

export type SendMessageType = z.infer<typeof sendMessage>;

const upVote = z.object({
  messageId: z.string(),
  roomId: z.string(),
  type: z.literal("UP_VOTE"),
  userId: z.string(),
});

export type upVoteType = z.infer<typeof upVote>;

const downVote = z.object({
  messageId: z.string(),
  roomId: z.string(),
  type: z.literal("DOWN_VOTE"),
  userId: z.string(),
});

export type downVoteType = z.infer<typeof downVote>;
