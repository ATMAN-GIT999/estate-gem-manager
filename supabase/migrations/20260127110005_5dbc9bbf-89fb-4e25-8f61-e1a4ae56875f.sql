-- Create enum for messaging channels
CREATE TYPE public.messaging_channel AS ENUM ('whatsapp', 'airbnb', 'booking_com', 'email', 'instagram', 'other');

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel messaging_channel NOT NULL,
  external_id TEXT, -- Platform-specific conversation ID
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'open', -- open, closed, archived
  unread_count INTEGER NOT NULL DEFAULT 0,
  last_message_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_type TEXT NOT NULL, -- guest, admin
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text', -- text, image, file
  external_id TEXT, -- Platform-specific message ID
  read_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create channel connections table for API credentials
CREATE TABLE public.channel_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel messaging_channel NOT NULL UNIQUE,
  is_connected BOOLEAN NOT NULL DEFAULT false,
  connection_status TEXT DEFAULT 'disconnected', -- connected, disconnected, error
  last_sync_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Admins can manage all conversations"
  ON public.conversations FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for messages
CREATE POLICY "Admins can manage all messages"
  ON public.messages FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for channel_connections
CREATE POLICY "Admins can manage channel connections"
  ON public.channel_connections FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_conversations_channel ON public.conversations(channel);
CREATE INDEX idx_conversations_status ON public.conversations(status);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_created ON public.messages(created_at);

-- Triggers for updated_at
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_channel_connections_updated_at
  BEFORE UPDATE ON public.channel_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default channel connections
INSERT INTO public.channel_connections (channel, is_connected) VALUES
  ('whatsapp', false),
  ('airbnb', false),
  ('booking_com', false),
  ('email', false),
  ('instagram', false);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;