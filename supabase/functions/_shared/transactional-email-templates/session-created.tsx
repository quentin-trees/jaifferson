/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Link, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Jaifferson'

interface Props {
  hostName?: string
  sessionTitle?: string
  sessionUrl?: string
  scheduledAt?: string
  topicRefined?: string
  questions?: string[]
}

const SessionCreatedEmail = ({ hostName, sessionTitle, sessionUrl, scheduledAt, topicRefined, questions }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Jaifferson session "{sessionTitle || 'Untitled'}" is live</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>{SITE_NAME}</Text>

        <Heading style={h1}>
          {hostName ? `${hostName}, your table is set.` : 'Your table is set.'}
        </Heading>

        <Text style={text}>
          Your session <strong>"{sessionTitle}"</strong> has been published and is now visible to participants.
        </Text>

        {topicRefined && (
          <Section>
            <Text style={sectionLabel}>Topic</Text>
            <Text style={text}>{topicRefined}</Text>
          </Section>
        )}

        {scheduledAt && (
          <Section>
            <Text style={sectionLabel}>Scheduled</Text>
            <Text style={text}>{scheduledAt}</Text>
          </Section>
        )}

        {questions && questions.length > 0 && (
          <Section>
            <Text style={sectionLabel}>Onboarding questions</Text>
            {questions.map((q, i) => (
              <Text key={i} style={questionStyle}>{i + 1}. {q}</Text>
            ))}
          </Section>
        )}

        <Hr style={divider} />

        <Text style={text}>
          Share the session link with the people you want to invite. They'll see the topic, your profile, and can apply to join.
        </Text>

        {sessionUrl && (
          <Button href={sessionUrl} style={button}>
            View your session →
          </Button>
        )}

        <Hr style={divider} />

        <Text style={footer}>
          This is a confirmation from {SITE_NAME}. You received this because you created a session.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: SessionCreatedEmail,
  subject: (data: Record<string, any>) =>
    `Your table is set: "${data?.sessionTitle || 'New session'}"`,
  displayName: 'Session created (host confirmation)',
  previewData: {
    hostName: 'Quentin',
    sessionTitle: 'Beyond the Stack: Human Agency in the Era of AI Agents',
    sessionUrl: 'https://jaifferson.lovable.app/session/abc123',
    scheduledAt: 'Thursday, April 3, 2026 · 20:00',
    topicRefined: 'How do we maintain human agency when AI agents orchestrate more of our workflows?',
    questions: [
      'What is one decision you have recently delegated to an AI agent?',
      'Where do you draw the line between efficiency and autonomy?',
    ],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Georgia', 'Times New Roman', serif" }
const container = { padding: '24px 28px', maxWidth: '560px', margin: '0 auto' }
const brand = { fontFamily: "'Georgia', serif", fontSize: '22px', color: '#1B3A5C', borderBottom: '1px solid #E8E4DC', paddingBottom: '16px', marginBottom: '28px' }
const h1 = { fontFamily: "'Georgia', serif", fontSize: '24px', fontWeight: 'normal' as const, color: '#1B3A5C', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#6B7280', lineHeight: '1.7', margin: '0 0 20px', fontFamily: "'Inter', Arial, sans-serif" }
const sectionLabel = { fontSize: '11px', fontWeight: '600' as const, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#1B3A5C', margin: '24px 0 12px', fontFamily: "'Inter', Arial, sans-serif" }
const questionStyle = { fontSize: '14px', color: '#6B7280', lineHeight: '1.6', margin: '0 0 6px', fontFamily: "'Inter', Arial, sans-serif" }
const divider = { borderColor: '#E8E4DC', margin: '28px 0' }
const button = { backgroundColor: '#1B3A5C', color: '#F5F2EB', fontSize: '14px', borderRadius: '0px', padding: '12px 24px', textDecoration: 'none', fontFamily: "'Inter', Arial, sans-serif" }
const footer = { fontSize: '12px', color: '#9CA3AF', margin: '24px 0 0', fontFamily: "'Inter', Arial, sans-serif" }
