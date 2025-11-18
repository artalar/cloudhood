export type RequestHeader = {
  id: number;
  name: string;
  value: string;
  disabled: boolean;
};
export type UrlFilter = {
  id: number;
  value: string;
  disabled: boolean;
};

export type MockOverride = {
  id: number;
  urlPattern: string;
  responseContent: string;
  disabled: boolean;
};

export type Profile = { 
  id: string; 
  name?: string; 
  requestHeaders: RequestHeader[]; 
  urlFilters: UrlFilter[];
  mockOverrides?: MockOverride[];
};

export type RemoveHeaderPayload = {
  headerId: number;
};
