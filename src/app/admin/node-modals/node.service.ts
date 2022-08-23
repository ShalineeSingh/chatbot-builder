import { Injectable } from '@angular/core';

export interface INode {
  tenant_id: number;
  bot_id: number;
  node_id?: number;
  node_name: string; // get this added  
  type: 'interactive' | 'text' | 'image' | 'video' | 'document';
  deleted: boolean;
  response: any;
  total_response_node_count: number;
  sequence: number;
  intent?: string;
  previous_node_id?: number;
  previous_node_name?: string; // get this added
  api_id?: number;
}

export interface ITextRepsonse {
  text: {
    body: string
  }
}

interface IMedia {
  link: string;
  provider?: {
    name: string; // additional configurations like a bearer token
  }
  caption?: string;  // 1024 chars
}

export interface IImageResponse {
  image: IMedia;
}

export interface IVideoResponse {
  video: IMedia;
}
export interface IDocumnentResponse {
  document: IMedia;
}

export interface IInteractiveResponse {
  type: 'list' | 'button';
  header?: {
    type: 'text' | 'image' | 'video' | 'document';
    document?: IMedia;
    image?: IMedia;
    video?: IMedia;
    text?: string;
  },
  body: {
    text: string; //1024 chars
  },
  footer?: {
    text: string;
  },
  action: {
    button?: string; // 20 chars - required for list

    buttons?: {   // Required for Reply Button Messages.
      type: 'reply';
      reply: {
        title: string; // 20 chars
        id: string;
      }
    }[];

    sections?: { // Required for List Messages
      title: string;
      rows: {
        title: string; // 24 chars
        id: string; // 200 chars
        description?: string; // 72 chars
      }[]
    }[];

  }
}

@Injectable()
export class NodeService {
}