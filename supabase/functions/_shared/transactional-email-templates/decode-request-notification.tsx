import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface DecodeRequestNotificationProps {
  requesterEmail?: string
  targetUrl?: string
}

const DecodeRequestNotificationEmail = ({ requesterEmail, targetUrl }: DecodeRequestNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New cloarec.ai decode request</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>NEW REQUEST</Text>
        <Heading style={h1}>A new decode request just came in</Heading>

        <Section style={panel}>
          <Text style={label}>Requester</Text>
          <Text style={value}>{requesterEmail ?? 'unknown'}</Text>
          <Hr style={hr} />
          <Text style={label}>Target URL</Text>
          <Text style={value}>{targetUrl ?? 'unknown'}</Text>
        </Section>

        <Text style={text}>
          Review the request in the backend queue and continue the manual profile workflow.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: DecodeRequestNotificationEmail,
  subject: ({ requesterEmail }: DecodeRequestNotificationProps) => `New Cloarec.ai decode request — ${requesterEmail ?? 'unknown'}`,
  displayName: 'Decode request notification',
  to: 'quentin@cloarec.ai',
  previewData: {
    requesterEmail: 'quentin@cloarec.ai',
    targetUrl: 'https://www.linkedin.com/in/example',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Inter, system-ui, sans-serif',
  margin: '0 auto',
  padding: '32px 0',
}

const container = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '0 24px',
}

const eyebrow = {
  color: 'hsl(39 49% 58%)',
  fontSize: '11px',
  letterSpacing: '0.22em',
  textTransform: 'uppercase' as const,
  margin: '0 0 16px',
}

const h1 = {
  color: 'hsl(211 56% 11%)',
  fontFamily: "Fraunces, 'Playfair Display', Georgia, serif",
  fontSize: '30px',
  fontWeight: '500',
  lineHeight: '1.1',
  margin: '0 0 18px',
}

const panel = {
  border: '1px solid hsl(211 30% 22% / 0.18)',
  padding: '18px 20px',
  margin: '24px 0',
}

const label = {
  color: 'hsl(36 27% 71%)',
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
  margin: '0 0 6px',
}

const value = {
  color: 'hsl(211 56% 11%)',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
}

const hr = {
  borderColor: 'hsl(211 30% 22% / 0.18)',
  margin: '14px 0',
}

const text = {
  color: 'hsl(211 30% 22%)',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0',
}
