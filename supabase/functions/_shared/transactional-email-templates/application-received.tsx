/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Link, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Jaifferson'

interface Props {
  applicantName?: string
  sessionTitle?: string
  sessionUrl?: string
  answers?: Array<{ question: string; answer: string }>
}

const ApplicationReceivedEmail = ({ applicantName, sessionTitle, sessionUrl, answers }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New application for {sessionTitle || 'your session'} from {applicantName || 'a participant'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>{SITE_NAME}</Text>
        <Heading style={h1}>New application received</Heading>
        <Text style={text}>
          <strong>{applicantName || 'Someone'}</strong> has applied to join your session{' '}
          <strong>{sessionTitle || 'Untitled'}</strong>.
        </Text>

        {answers && answers.length > 0 && (
          <Section>
            <Text style={sectionLabel}>Their answers</Text>
            {answers.map((a, i) => (
              <Section key={i} style={answerBlock}>
                <Text style={questionStyle}>{a.question}</Text>
                <Text style={answerStyle}>{a.answer}</Text>
              </Section>
            ))}
          </Section>
        )}

        <Hr style={divider} />

        {sessionUrl && (
          <Button style={button} href={sessionUrl}>
            Review on Dashboard
          </Button>
        )}

        <Text style={footer}>
          Review and accept or decline this application from your dashboard.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ApplicationReceivedEmail,
  subject: (data: Record<string, any>) =>
    `New application: ${data?.applicantName || 'Someone'} → ${data?.sessionTitle || 'your session'}`,
  displayName: 'Application received (host notification)',
  previewData: {
    applicantName: 'Marie Dupont',
    sessionTitle: 'The Future of AI in Venture Building',
    sessionUrl: 'https://jaifferson.lovable.app/dashboard',
    answers: [
      { question: 'What draws you to this topic?', answer: 'I have been working on AI agents for the past year and want to challenge my assumptions with peers.' },
    ],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Georgia', 'Times New Roman', serif" }
const container = { padding: '24px 28px', maxWidth: '560px', margin: '0 auto' }
const brand = { fontFamily: "'Georgia', serif", fontSize: '22px', color: '#1B3A5C', borderBottom: '1px solid #E8E4DC', paddingBottom: '16px', marginBottom: '28px' }
const h1 = { fontFamily: "'Georgia', serif", fontSize: '24px', fontWeight: 'normal' as const, color: '#1B3A5C', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#6B7280', lineHeight: '1.7', margin: '0 0 20px', fontFamily: "'Inter', Arial, sans-serif" }
const sectionLabel = { fontSize: '11px', fontWeight: '600' as const, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#1B3A5C', margin: '24px 0 12px', fontFamily: "'Inter', Arial, sans-serif" }
const answerBlock = { marginBottom: '16px' }
const questionStyle = { fontSize: '13px', fontWeight: '600' as const, color: '#374151', margin: '0 0 4px', fontFamily: "'Inter', Arial, sans-serif" }
const answerStyle = { fontSize: '14px', color: '#6B7280', lineHeight: '1.6', margin: '0', fontFamily: "'Inter', Arial, sans-serif" }
const divider = { borderColor: '#E8E4DC', margin: '28px 0' }
const button = { backgroundColor: '#1B3A5C', color: '#F5F2EB', fontSize: '14px', borderRadius: '0px', padding: '12px 24px', textDecoration: 'none', fontFamily: "'Inter', Arial, sans-serif" }
const footer = { fontSize: '12px', color: '#9CA3AF', margin: '24px 0 0', fontFamily: "'Inter', Arial, sans-serif" }
